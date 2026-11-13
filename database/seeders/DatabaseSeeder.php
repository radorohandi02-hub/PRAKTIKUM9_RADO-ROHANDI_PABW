<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(['email' => 'admin@sipustaka.test'], [
            'name' => 'Petugas Admin',
            'password' => 'password',
            'role' => 'admin',
        ]);

        User::firstOrCreate(['email' => 'user@sipustaka.test'], [
            'name' => 'Anggota User',
            'password' => 'password',
            'role' => 'user',
        ]);
    }
}
