<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Owner Event',
            'email' => 'owner@mail.com',
            'password' => Hash::make('password'),
            'role_id' => 1,
        ]);
    }
}