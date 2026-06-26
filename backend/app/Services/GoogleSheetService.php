<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GoogleSheetService
{
    public function send($order)
    {
        $url = env('GOOGLE_SHEET_WEBHOOK');

        return Http::post($url, [

            'order_code' =>
                $order->order_code,

            'customer_name' =>
                $order->customer_name,

            'customer_email' =>
                $order->customer_email,

            'customer_phone' =>
                $order->customer_phone,

            'ticket_name' =>
                $order->ticketType->name,

            'quantity' =>
                $order->quantity,

            'payment_status' =>
                $order->payment_status,

        ]);
    }
}