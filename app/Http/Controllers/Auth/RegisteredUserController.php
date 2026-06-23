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
        // 1. Validasi Input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'whatsapp' => 'required|string|max:20|unique:'.User::class, // Pastikan nomor unik
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // 2. Format nomor WA & Bikin Kode OTP
        $phone = $this->formatNomorWa($request->whatsapp);
        $otpCode = rand(100000, 999999);

        // 3. Simpan data pendaftaran ke Cache (berlaku 5 menit)
        // Kita belum save ke database sebelum OTP-nya benar!
        Cache::put('register_otp_' . $phone, [
            'otp' => $otpCode,
            'name' => $request->name,
            'email' => $request->email,
            'whatsapp' => $phone,
            'password' => Hash::make($request->password),
        ], now()->addMinutes(5));

        // 4. Kirim Pesan WA via Fonnte
        $response = Http::withHeaders([
            'Authorization' => env('FONNTE_TOKEN') // Pastikan lu isi ini di file .env
        ])->post('https://api.fonnte.com/send', [
            'target' => $phone,
            'message' => "*VERIFIKASI AKUN*\n\nKode OTP Anda adalah: *$otpCode*.\n\nKode ini berlaku selama 5 menit. Jangan berikan kode ini kepada siapapun.",
            'countryCode' => '62',
        ]);

        if ($response->successful()) {
            // Lempar ke halaman masukin OTP, bawa data nomor WA-nya
            return redirect()->route('verify-otp.show')->with('whatsapp', $phone);
        }

        // Kalau gagal ngirim WA
        return back()->withErrors(['whatsapp' => 'Gagal mengirim kode OTP. Pastikan nomor WhatsApp aktif.']);
    }

    /**
     * Menampilkan halaman UI untuk masukin OTP
     */
    public function showVerifyOtp(): Response
    {
        // Kita ambil nomor WA dari session
        $whatsapp = session('whatsapp');

        if (!$whatsapp) {
            return Inertia::render('Auth/Register'); // Kalau ga ada nomor, suruh regis ulang
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
            'password' => $cachedData['password'], // Udah di-hash dari awal
            'role_id' => $userRole->id,
        ]);

        // Bersihkan memori Cache
        Cache::forget('register_otp_' . $phone);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('onboarding.kategori', absolute: false));
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

        // Tembak ulang API Fonnte
        Http::withHeaders([
            'Authorization' => env('FONNTE_TOKEN')
        ])->post('https://api.fonnte.com/send', [
            'target' => $phone,
            'message' => "*KIRIM ULANG OTP*\n\nKode OTP baru Anda adalah: *$newOtpCode*.\n\nKode ini berlaku selama 5 menit. Jangan berikan kode ini kepada siapapun.",
            'countryCode' => '62',
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