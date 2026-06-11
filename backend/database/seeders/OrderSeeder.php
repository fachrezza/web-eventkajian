<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('orders')->insert([

            [
                'order_code' => 'ORD-' . strtoupper(Str::random(8)),
                'event_id' => 1,
                'ticket_type_id' => 1,

                'customer_name' => 'Andi',
                'customer_email' => 'andifachreza2002@gmail.com',
                'customer_phone' => '081234567890',

                'quantity' => 2,
                'total_amount' => 100000,

                'payment_status' => 'pending',

                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}