<?php

namespace App\Filament\Resources\SesiSeminars\RelationManagers;

use App\Models\Enrollment;
use App\Models\User;
use App\Models\SesiSeminar;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TimePicker;
use Filament\Schemas\Schema; // Reverted to Schema
use Filament\Schemas\Components\Utilities\Get;
use Filament\Notifications\Notification;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Actions\BulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\HtmlString;

class AbsensiRelationManager extends RelationManager
{
    protected static string $relationship = 'absensi';

    protected static ?string $title = 'Peserta & Absensi';

    public function form(\Filament\Schemas\Schema $schema): \Filament\Schemas\Schema // Corrected signature and return type
    {
        return $schema
            ->schema([
                Placeholder::make('info')
                    ->label('Info')
                    ->content(fn (Get $get) => $this->getRelationManagerHeaderInfo($get))
                    ->columnSpanFull(),
                Select::make('user_id')
                    ->label('Peserta')
                    ->options(fn (Get $get) => $this->getAvailableUsers($get))
                    ->searchable()
                    ->required()
                    ->columnSpanFull(),
                Select::make('status')
                    ->label('Status Kehadiran')
                    ->options([
                        'belum' => 'Belum Absen',
                        'hadir' => 'Hadir',
                        'tidak_hadir' => 'Tidak Hadir',
                    ])
                    ->default('belum')
                    ->required()
                    ->columnSpanFull(),
                TimePicker::make('waktu_absen')
                    ->label('Waktu Absen')
                    ->native(false)
                    ->displayFormat('H:i')
                    ->default(now())
                    ->hidden(fn (Get $get) => $get('status') === 'belum')
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->with([
                'sesiSeminar',
                'user.voucherRedemptions.voucher.corporateUser.corporateProfile'
            ])) // Eager load relasi untuk mencegah N+1
            ->columns([
                TextColumn::make('user.name')
                    ->label('Nama Peserta')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('asal_korporat')
                    ->label('Asal Korporat/Instansi')
                    ->getStateUsing(function ($record) {
                        // 1. Ambil course_id dari sesi seminar saat ini
                        $courseId = $record->sesiSeminar?->course_id;
                        if (!$courseId) return '-';

                        // 2. Filter voucher_redemptions milik user yang course_id-nya sesuai
                        $redemption = $record->user?->voucherRedemptions
                            ->first(fn ($r) => $r->voucher?->course_id === $courseId);

                        // 3. Ambil nama_perusahaan
                        return $redemption?->voucher?->corporateUser?->corporateProfile?->nama_perusahaan ?? '-';
                    }),
                TextColumn::make('status')
                ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'belum' => 'Belum Absen',
                        'hadir' => 'Hadir',
                        'tidak_hadir' => 'Tidak Hadir',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'belum' => 'gray',
                        'hadir' => 'success',
                        'tidak_hadir' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('waktu_absen')
                    ->label('Waktu Absen')
                    ->dateTime('d M Y, H:i', 'Asia/Jakarta')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                CreateAction::make()
                    ->label('Tambah Peserta')
                    ->using(function (array $data) {
                        // Check capacity before creating
                        $ownerRecord = $this->getOwnerRecord();
                        $currentAbsensiCount = $ownerRecord->absensi()->count();
                        $capacity = $ownerRecord->kapasitas_ruangan;

                        if ($capacity !== null && $currentAbsensiCount >= $capacity) {
                            Notification::make()
                                ->title('Kapasitas ruangan penuh')
                                ->danger()
                                ->send();
                            throw new \Filament\Support\Exceptions\Halt();
                        }

                        // Create AbsensiSeminar
                        $absensi = $ownerRecord->absensi()->create([
                            'user_id' => $data['user_id'],
                            'status' => $data['status'] ?? 'belum',
                            'waktu_absen' => $data['status'] !== 'belum' ? $data['waktu_absen'] : null,
                        ]);

                        Notification::make()->success()->title('Peserta berhasil ditambahkan.')->send();
                        return $absensi;
                    })
                    ->after(function ($record) {
                        // Refresh the relation manager after creation
                        return $record;
                    }),
                BulkActionGroup::make([
                    BulkAction::make('tandai_hadir')
                        ->label('Tandai Hadir')
                        ->icon('heroicon-o-check-circle')
                        ->deselectRecordsAfterCompletion()
                        ->requiresConfirmation()
                        ->action(function ($records, Model $livewire) {
                            foreach ($records as $record) {
                                $record->update([
                                    'status' => 'hadir',
                                    'waktu_absen' => now(),
                                ]);
                            }
                            Notification::make()->success()->title('Peserta ditandai hadir.')->send();
                        }),
                    BulkAction::make('tandai_tidak_hadir')
                        ->label('Tandai Tidak Hadir')
                        ->icon('heroicon-o-x-circle')
                        ->deselectRecordsAfterCompletion()
                        ->requiresConfirmation()
                        ->action(function ($records, Model $livewire) {
                            foreach ($records as $record) {
                                $record->update([
                                    'status' => 'tidak_hadir',
                                    'waktu_absen' => null, // Clear absen time if not present
                                ]);
                            }
                            Notification::make()->success()->title('Peserta ditandai tidak hadir.')->send();
                        }),
                    DeleteBulkAction::make(),
                ]),
            ])
            ->recordActions([
                EditAction::make()
                    ->using(function ($record, $data) {
                        // Check capacity before updating, only if status is changing to 'hadir' or 'tidak_hadir' and it's not the current user
                        if ($data['status'] !== 'belum' && $record->status !== $data['status']) {
                            $currentAbsensiCount = $this->getOwnerRecord()->absensi()->count();
                            $capacity = $this->getOwnerRecord()->kapasitas_ruangan;

                            if ($capacity !== null && $currentAbsensiCount >= $capacity && $data['status'] === 'hadir') {
                                Notification::make()
                                    ->title('Kapasitas ruangan penuh')
                                    ->danger()
                                    ->send();
                                throw new \Filament\Support\Exceptions\Halt();
                            }
                        }

                        $record->update([
                            'user_id' => $data['user_id'],
                            'status' => $data['status'],
                            'waktu_absen' => $data['status'] !== 'belum' ? $data['waktu_absen'] : null,
                        ]);
                        return $record;
                    }),
                ViewAction::make(),
                DeleteAction::make(),
            ])
            ->paginated(false) // Tampilkan semua tanpa pagination
            ->emptyStateHeading('Belum ada peserta')
            ->defaultSort('user.name', 'asc');
    }

    protected function getRelationManagerHeaderInfo(Get $get): string
    {
        $record = $this->getOwnerRecord();
        $absensiCount = $record->absensi()->count();
        $capacity = $record->kapasitas_ruangan;

        if ($capacity === null) {
            return "Terisi {$absensiCount} / Tidak Terbatas";
        }

        $color = $absensiCount > $capacity ? 'text-danger-600' : 'text-success-600';
        return "Terisi <span class='font-bold {$color}'>{$absensiCount}</span> / {$capacity}";
    }

    protected function getAvailableUsers(Get $get): array
    {
        $sesiSeminar = $this->getOwnerRecord();
        $courseId = $sesiSeminar->course_id;

        // Dapatkan user yang ter-enroll di course ini DAN belum terdaftar di sesi lain pada course yang sama
        $enrolledUsers = Enrollment::where('course_id', $courseId)
            ->where('status', 'active')
            ->pluck('user_id');

        // Dapatkan user_id yang sudah terdaftar di sesi seminar lain untuk course ini
        $registeredUserIdsInOtherSessions = SesiSeminar::where('course_id', $courseId)
            ->where('id', '!=', $sesiSeminar->id) // Jangan periksa sesi ini sendiri
            ->with('absensi')
            ->get()
            ->flatMap(fn ($sesi) => $sesi->absensi->pluck('user_id'))
            ->unique();

        // Filter user yang ter-enroll tapi belum terdaftar di sesi lain
        $availableUserIds = $enrolledUsers->diff($registeredUserIdsInOtherSessions);

        // Ambil data user berdasarkan ID yang tersedia
        $users = User::whereIn('user_id', $availableUserIds)
            ->get()
            ->mapWithKeys(fn ($user) => [$user->user_id => $user->name]);

        return $users->toArray();
    }

    // Helper untuk mendapatkan nama instansi (perlu disesuaikan jika relasi berbeda)
    protected function getUserInstansiName(Model $user): string
    {
        // Asumsi: User model memiliki relasi 'corporateVoucher' atau 'enrollment' yang bisa di-join
        // Ini perlu disesuaikan berdasarkan struktur database Anda yang sebenarnya.
        // Contoh:
        // return $user->corporateVoucher->corporate_user->name ?? '-';
        // return $user->enrollment->course->title ?? '-'; // Contoh lain jika perlu

        // Placeholder jika relasi belum jelas
        return '-';
    }
}