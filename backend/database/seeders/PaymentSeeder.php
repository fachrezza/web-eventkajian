<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('payments')->insert([

            [
                'order_id' => 1,
                'provider' => 'midtrans',
                'transaction_id' => 'TRX-' . uniqid(),
                'payment_type' => 'qris',
                'gross_amount' => 100000,
                'transaction_status' => 'settlement',

                'raw_response' => json_encode([
                    'status_code' => 200,
                    'message' => 'Success',
                    'payment_type' => 'qris',
                    'transaction_status' => 'settlement',
                ]),

                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}