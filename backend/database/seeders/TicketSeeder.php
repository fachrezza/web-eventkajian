<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tickets')->insert([

            [
                'order_id' => 1,
                'ticket_code' => 'TKT-' . strtoupper(Str::random(10)),
                'qr_token' => Str::uuid(),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'order_id' => 1,
                'ticket_code' => 'TKT-' . strtoupper(Str::random(10)),
                'qr_token' => Str::uuid(),
                'status' => 'used',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'order_id' => 1,
                'ticket_code' => 'TKT-' . strtoupper(Str::random(10)),
                'qr_token' => Str::uuid(),
                'status' => 'cancelled',
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}