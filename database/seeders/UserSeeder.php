<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Bikin Role Admin dulu biar nggak error foreign key
        $adminRole = Role::firstOrCreate(['role_name' => 'Admin']);
        
        // Opsional: Sekalian bikin Role User biasa
        Role::firstOrCreate(['role_name' => 'User']);

        // 2. Bikin Akun Super Admin
        User::firstOrCreate(
            ['email' => 'admin@gmail.com'], // Cek berdasarkan email
            [
                'name' => 'Admin Pensiun Mudah',
                'password' => Hash::make('123'), // Ganti password sesuai selera lu
                'role_id' => $adminRole->id, // Masukin ID dari role yang barusan dibuat
                'is_verified' => true,
            ]
        );
    }
}