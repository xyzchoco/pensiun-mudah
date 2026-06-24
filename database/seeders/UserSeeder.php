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
        $adminRole = Role::firstOrCreate(['role_name' => 'Admin']);
        
        
        Role::firstOrCreate(['role_name' => 'User']);

        
        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],

            [
                'name' => 'Admin Pensiun Mudah',
                'whatsapp' => '6281234567890', 
                'password' => Hash::make('123'), 
                'role_id' => $adminRole->id, 
                'is_verified' => true,
            ]
        );
    }
}