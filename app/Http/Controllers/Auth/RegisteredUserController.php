<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create()
    {
        return Inertia::render('Auth/Register', [
            'error'        => session('error'),
            'google_name'  => session('google_name'),
            'google_email' => session('google_email'),
        ]);
    }

    /**
     * Handle an incoming registration request (KIRIM OTP VIA EMAIL)
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $email = $request->email;
        
        // 1. Generate OTP 6 digit random
        $otpCode = rand(100000, 999999);

        // 2. Simpan data registrasi sementara di Cache (key by email)
        Cache::put('register_otp_' . $email, [
            'otp' => $otpCode,
            'name' => $request->name,
            'email' => $email,
            'password' => Hash::make($request->password),
        ], now()->addMinutes(5));

        // 3. Kirim OTP via Email
        try {
            Mail::to($email)->send(new OtpMail($otpCode, $request->name));
        } catch (\Exception $e) {
            // Hapus cache karena email gagal dikirim
            Cache::forget('register_otp_' . $email);
            logger()->error('Gagal kirim email OTP: ' . $e->getMessage());
            return back()->withErrors([
                'email' => 'Gagal mengirim email verifikasi. Silakan coba lagi atau gunakan alamat email lain.',
            ]);
        }

        // 4. Simpan email di session & redirect ke halaman verifikasi OTP
        session(['email_verification' => $email]);
        return redirect()->route('verify-otp.show');
    }

    /**
     * Menampilkan halaman UI untuk masukin OTP
     */
    public function showVerifyOtp(): Response|RedirectResponse
    {
        $email = session('email_verification');

        if (!$email) {
            return redirect()->route('register');
        }

        return Inertia::render('Auth/VerifyOtp', [
            'email' => $email,
        ]);
    }

    /**
     * Eksekusi cek OTP dan Buat Akun (FINISH)
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|email',
            'otp' => 'required|numeric',
        ]);

        $email = $request->email;
        $inputOtp = $request->otp;

        // Tarik data sementara dari Cache
        $cachedData = Cache::get('register_otp_' . $email);

        // Kalau OTP expired atau salah
        if (!$cachedData || (int) $cachedData['otp'] !== (int) $inputOtp) {
            return back()->withErrors(['otp' => 'Kode OTP salah atau sudah kedaluwarsa.']);
        }

        // Kalau Valid, Bikin Akunnya!
        $userRole = Role::firstOrCreate(['role_name' => 'User']);

        $user = User::create([
            'name' => $cachedData['name'],
            'email' => $cachedData['email'],
            'password' => $cachedData['password'],
            'role_id' => $userRole->id,
            'email_verified_at' => now(),
        ]);

        // Bersihkan memori Cache & Session
        Cache::forget('register_otp_' . $email);
        session()->forget('email_verification');

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('onboarding.kategori');
    }

    /**
     * Eksekusi Kirim Ulang OTP
     */
    public function resendOtp(Request $request): RedirectResponse
    {
        $email = $request->email;

        // Cek apakah data user masih ada di Cache
        $cachedData = Cache::get('register_otp_' . $email);

        if (!$cachedData) {
            return redirect()->route('register')->withErrors(['email' => 'Sesi pendaftaran kedaluwarsa. Silakan daftar ulang.']);
        }

        // Bikin OTP baru
        $newOtpCode = rand(100000, 999999);

        // Update Cache dengan OTP baru, perpanjang umur 5 menit lagi
        $cachedData['otp'] = $newOtpCode;
        Cache::put('register_otp_' . $email, $cachedData, now()->addMinutes(5));

        // Kirim ulang via Email
        try {
            Mail::to($email)->send(new OtpMail($newOtpCode, $cachedData['name']));
        } catch (\Exception $e) {
            logger()->error('Gagal kirim ulang email OTP: ' . $e->getMessage());
            return back()->withErrors([
                'otp' => 'Gagal mengirim ulang email. Silakan coba beberapa saat lagi.',
            ]);
        }

        return back();
    }
}
