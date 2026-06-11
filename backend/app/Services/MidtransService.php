<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');

        Config::$isProduction = config(
            'services.midtrans.is_production'
        );

        Config::$isSanitized = true;

        Config::$is3ds = true;
    }

    public function createTransaction($order)
    {
        $params = [

            'transaction_details' => [

                'order_id' => $order->order_code,

                'gross_amount' => $order->total_amount,

            ],

            'customer_details' => [

                'first_name' => $order->customer_name,

                'email' => $order->customer_email,

                'phone' => $order->customer_phone,

            ]

        ];

        return Snap::getSnapToken($params);
    }
}