<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::create([
            'name' => 'owner'
        ]);

        Role::create([
            'name' => 'admin'
        ]);

        Role::create([
            'name' => 'operator'
        ]);

        Role::create([
            'name' => 'finance'
        ]);
    }
}