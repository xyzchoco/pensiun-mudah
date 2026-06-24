<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request (KIRIM OTP)
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. FORMAT NOMOR WA DULUAN SEBELUM DIVALIDASI!
        // Biar kalau user ngetik 08..., langsung diubah jadi 628... di dalam Request
        if ($request->filled('whatsapp')) {
            $request->merge([
                'whatsapp' => $this->formatNomorWa($request->whatsapp)
            ]);
        }

        // 2. BARU LAKUKAN VALIDASI
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'whatsapp' => 'required|string|max:20|unique:'.User::class, // Ini sekarang ngecek yang 628...
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $phone = $request->whatsapp; // Ini otomatis udah 628...
        
        // 3. SET OTP STATIS UNTUK BYPASS
        $otpCode = 123456; 

        Cache::put('register_otp_' . $phone, [
            'otp' => $otpCode,
            'name' => $request->name,
            'email' => $request->email,
            'whatsapp' => $phone,
            'password' => Hash::make($request->password),
        ], now()->addMinutes(5));

        // 4. LANGSUNG ANGGAP SUKSES & LEMPAR KE HALAMAN OTP
        session(['whatsapp_verification' => $phone]);
        return redirect()->route('verify-otp.show');
    }

    /**
     * Menampilkan halaman UI untuk masukin OTP
     */
    public function showVerifyOtp(): Response|RedirectResponse
    {
        // Ambil dari session yang diset di method store
        $whatsapp = session('whatsapp_verification');

        if (!$whatsapp) {
            return redirect()->route('register'); // Redirect pakai route name yang benar
        }

        return Inertia::render('Auth/VerifyOtp', [
            'whatsapp' => $whatsapp
        ]);
    }

    /**
     * Eksekusi cek OTP dan Buat Akun (FINISH)
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'whatsapp' => 'required|string',
            'otp' => 'required|numeric',
        ]);


        $phone = $request->whatsapp;
        $inputOtp = $request->otp;

        // Tarik data sementara dari Cache
        $cachedData = Cache::get('register_otp_' . $phone);

        // Kalau OTP expired atau salah
        if (!$cachedData || $cachedData['otp'] != $inputOtp) {
            return back()->withErrors(['otp' => 'Kode OTP salah atau sudah kedaluwarsa.']);
        }

        // Kalau Valid, Bikin Akunnya!
        $userRole = Role::firstOrCreate(['role_name' => 'User']);

        $user = User::create([
            'name' => $cachedData['name'],
            'email' => $cachedData['email'],
            'whatsapp' => $cachedData['whatsapp'],
            'password' => $cachedData['password'],
            'role_id' => $userRole->id,
        ]);

        // Bersihkan memori Cache & Session
        Cache::forget('register_otp_' . $phone);
        session()->forget('whatsapp_verification');

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('onboarding.kategori'); // Sesuaikan dengan route yang ada
    }

    /**
     * Eksekusi Kirim Ulang OTP
     */
    public function resendOtp(Request $request): RedirectResponse
    {
        $phone = $request->whatsapp;

        // Cek apakah data user masih ada di Cache
        $cachedData = Cache::get('register_otp_' . $phone);

        if (!$cachedData) {
            // Kalau udah bener-bener hangus dari memori, suruh daftar dari awal
            return redirect()->route('register')->withErrors(['whatsapp' => 'Sesi pendaftaran kedaluwarsa. Silakan daftar ulang.']);
        }

        // Bikin OTP baru
        $newOtpCode = rand(100000, 999999);

        // Update Cache dengan OTP baru, perpanjang umur 5 menit lagi
        $cachedData['otp'] = $newOtpCode;
        Cache::put('register_otp_' . $phone, $cachedData, now()->addMinutes(5));

        // Tembak ulang API Fonnte (dengan asForm dan tanpa countryCode)
        Http::withHeaders([
            'Authorization' => env('FONNTE_TOKEN')
        ])->asForm()->post('https://api.fonnte.com/send', [
            'target' => $phone,
            'message' => "*KIRIM ULANG OTP*\n\nKode OTP baru Anda adalah: *$newOtpCode*.\n\nKode ini berlaku selama 5 menit. Jangan berikan kode ini kepada siapapun."
        ]);

        return back(); // Inertia onSuccess di React bakal jalan, reset timer ke 120 detik otomatis
    }

    /**
     * Bantuan untuk merapikan nomor HP (ubah 08... jadi 628...)
     */
    private function formatNomorWa($nomor)
    {
        $nomor = preg_replace('/[^0-9]/', '', $nomor);
        if (substr($nomor, 0, 1) === '0') {
            return '62' . substr($nomor, 1);
        } elseif (substr($nomor, 0, 1) === '8') {
            return '62' . $nomor;
        }
        return $nomor;
    }
}