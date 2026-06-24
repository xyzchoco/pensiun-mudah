<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckOnboarding
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Jika user korporat tapi belum punya profil (tabel kosong), 
        // paksa ke halaman verifikasi/onboarding
        if ($user && $user->kategori_pensiun === 'korporat' && !$user->corporateProfile) {
            return redirect()->route('korporat.verifikasi');
        }

        return $next($request);
    }
}
