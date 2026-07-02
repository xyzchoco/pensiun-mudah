<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CorporateProfileController extends Controller
{
    public function update(Request $request)
    {
        $user    = $request->user();
        $profile = $user->corporateProfile;

        $validated = $request->validate([
            'nama_perusahaan' => ['required', 'string', 'max:255'],
            'kategori_bisnis' => ['required', 'string', 'max:255'],
            'website'         => ['nullable', 'url', 'max:255'],
            'email_bisnis'    => [
                'nullable', 
                'email', 
                'max:255', 
                'unique:corporate_profiles,email_bisnis,' . $user->user_id . ',user_id'
            ],
            'no_telepon'      => [
                'nullable', 
                'string', 
                'max:50', 
                'unique:corporate_profiles,no_telepon,' . $user->user_id . ',user_id'
            ],
            'alamat_kantor'   => ['nullable', 'string', 'max:1000'],
            'logo'            => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ], [
            'email_bisnis.unique' => 'Email bisnis ini sudah terdaftar oleh perusahaan lain.',
            'no_telepon.unique'   => 'Nomor telepon ini sudah digunakan oleh perusahaan lain.',
        ]);

        if ($request->hasFile('logo')) {
            if ($profile && $profile->logo_path) {
                Storage::disk('public')->delete($profile->logo_path);
            }
            $validated['logo_path'] = $request->file('logo')->store('logos', 'public');
        }

        unset($validated['logo']);

        $user->corporateProfile()->updateOrCreate([], $validated);

        $redirect = str_contains($request->path(), 'instansi')
            ? '/instansi/profil-perusahaan'
            : '/korporat/profil-perusahaan';

        return redirect($redirect)->with('success', 'Profil perusahaan berhasil diperbarui!');
    }
}