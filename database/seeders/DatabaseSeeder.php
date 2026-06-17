<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Kita bikin Role-nya langsung di sini
        $roleAdmin = Role::create([
            'role_name' => 'Admin' 
        ]);

        // 2. Bikin User dan masukin ID dari role yang di atas
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role_id' => $roleAdmin->id, 
        ]);
    }
}