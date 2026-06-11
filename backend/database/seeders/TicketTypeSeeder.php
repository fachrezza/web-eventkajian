<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TicketTypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('ticket_types')->insert([
            [
                'event_id' => 1,
                'name' => 'Regular',
                'description' => 'Tiket reguler event kajian',
                'price' => 50000,
                'quota' => 100,
                'sold' => 0,
                'max_per_order' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'event_id' => 1,
                'name' => 'VIP',
                'description' => 'Tiket VIP dengan seat depan',
                'price' => 150000,
                'quota' => 30,
                'sold' => 0,
                'max_per_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}