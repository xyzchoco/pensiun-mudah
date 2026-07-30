<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\LaravelPdf\Facades\Pdf;

class SertifikatController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $enrollments = Enrollment::with(['course'])
            ->where('user_id', $userId)
            ->whereIn('status', ['active', 'completed'])
            ->get();

        $certificatesData = [];

        foreach ($enrollments as $enroll) {
            $executionDate = $enroll->tanggal_mulai ?: $enroll->course->tanggal_default;
            $isOfflinePassed = false;
            if (in_array($enroll->course->tipe_kelas, ['Offline', 'Hybrid'])) {
                if ($executionDate && \Carbon\Carbon::parse($executionDate)->startOfDay()->lt(now()->startOfDay())) {
                    $isOfflinePassed = true;
                }
            }

            if ($enroll->is_completed || $enroll->status === 'completed' || $isOfflinePassed) {
                $tanggalSelesai = $enroll->tanggal_selesai ?: ($isOfflinePassed ? $executionDate : null);

                $certificatesData[] = [
                    'id'    => $enroll->course->id,
                    'title' => $enroll->course->title,
                    'raw_date' => $tanggalSelesai ? Carbon::parse($tanggalSelesai) : null,
                    'date'  => $tanggalSelesai
                        ? Carbon::parse($tanggalSelesai)->translatedFormat('d F Y')
                        : '-',
                    'image' => $enroll->course->thumbnail
                        ? Storage::url(preg_replace('/^public\//', '', $enroll->course->thumbnail))
                        : '/images/cert-sample.png',
                ];
            }
        }

        usort($certificatesData, function($a, $b) {
            if (!$a['raw_date']) return 1;
            if (!$b['raw_date']) return -1;
            return $b['raw_date']->timestamp <=> $a['raw_date']->timestamp;
        });

        $certificates = array_map(function($c) {
            unset($c['raw_date']);
            return $c;
        }, $certificatesData);

        return Inertia::render('Sertifikat', [
            'certificates' => $certificates,
        ]);
    }

    // Guard server-side saat buka 1 sertifikat spesifik
    public function show($courseId)
    {
        $userId = auth()->id();

        $enrollment = Enrollment::with(['course'])
            ->where('user_id', $userId)
            ->where('course_id', $courseId)
            ->first();

        abort_unless($enrollment, 403, 'Kamu belum menyelesaikan kursus ini.');

        $executionDate = $enrollment->tanggal_mulai ?: $enrollment->course->tanggal_default;
        $isOfflinePassed = false;
        if (in_array($enrollment->course->tipe_kelas, ['Offline', 'Hybrid'])) {
            if ($executionDate && \Carbon\Carbon::parse($executionDate)->startOfDay()->lt(now()->startOfDay())) {
                $isOfflinePassed = true;
            }
        }

        abort_unless($enrollment->is_completed || $enrollment->status === 'completed' || $isOfflinePassed, 403, 'Kamu belum menyelesaikan kursus ini.');

        $course = $enrollment->course;
        $tanggalSelesai = $enrollment->tanggal_selesai ?: ($isOfflinePassed ? $executionDate : null);

        $issueDate = $tanggalSelesai
            ? Carbon::parse($tanggalSelesai)->translatedFormat('d F Y')
            : '-';
        $description = 'Selamat! Anda telah berhasil menyelesaikan pelatihan ' . $course->title . '. Sertifikat ini merupakan bukti kompetensi Anda dalam menyelesaikan pelatihan untuk masa purnabakti yang sejahtera.';

        return Inertia::render('Sertifikat/DetailSertifikat', [
            'certificate' => [
                'id'           => $course->id,
                'title'        => $course->title,
                'date'         => $issueDate,
                'issue_date'   => $issueDate,
                'name'         => auth()->user()->name,
                'image'        => '/images/cert-sample.png',
                'description'  => $description,
                'download_url' => route('sertifikat.download', $courseId),
            ],
        ]);
    }

    /**
     * Generate dan download sertifikat sebagai PDF
     */
    public function download($courseId)
    {
        $userId = auth()->id();

        $enrollment = Enrollment::with(['course'])
            ->where('user_id', $userId)
            ->where('course_id', $courseId)
            ->first();

        abort_unless($enrollment, 403, 'Kamu belum menyelesaikan kursus ini.');

        $executionDate = $enrollment->tanggal_mulai ?: $enrollment->course->tanggal_default;
        $isOfflinePassed = false;
        if (in_array($enrollment->course->tipe_kelas, ['Offline', 'Hybrid'])) {
            if ($executionDate && \Carbon\Carbon::parse($executionDate)->startOfDay()->lt(now()->startOfDay())) {
                $isOfflinePassed = true;
            }
        }

        abort_unless($enrollment->is_completed || $enrollment->status === 'completed' || $isOfflinePassed, 403, 'Kamu belum menyelesaikan kursus ini.');

        $course = $enrollment->course;
        $user = auth()->user();

        $fileName = 'Sertifikat_' . str_replace(' ', '_', $course->title) . '_' . str_replace(' ', '_', $user->name) . '.pdf';

        if (!$enrollment->tanggal_selesai && $isOfflinePassed) {
            $enrollment->tanggal_selesai = $executionDate;
        }

        return Pdf::view('pdf.sertifikat', [
                'course' => $course,
                'user' => $user,
                'enrollment' => $enrollment,
            ])
            ->format('a4')
            ->landscape()
            ->name($fileName);
    }
}
