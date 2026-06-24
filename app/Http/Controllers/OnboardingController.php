<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    // Nampilin halaman pilih kategori
    public function show()
    {
        return Inertia::render('Auth/PilihKategori'); // Sesuaikan nama file React lu
    }

    // Eksekusi simpan kategori
    public function store(Request $request)
    {
        $request->validate([
            // Pastikan isinya cuma 3 ini yang diizinkan
            'kategori' => 'required|in:publik,korporat,asn' 
        ]);

        $user = auth()->user();
        
        // Simpan pilihannya ke database
        $user->update([
            'kategori_akun' => $request->kategori
        ]);

        // Lempar ke dashboard
        return redirect()->route('dashboard');
    }
}