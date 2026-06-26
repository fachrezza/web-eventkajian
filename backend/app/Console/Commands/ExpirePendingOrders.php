<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\Order;

class ExpirePendingOrders extends Command
{
    protected $signature =
        'orders:expire';

    protected $description =
        'Expire pending orders';

    public function handle()
    {
        $orders = Order::where(
                'payment_status',
                'pending'
            )
            ->where(
                'expired_at',
                '<',
                now()
            )
            ->get();

        foreach ($orders as $order) {

            $order->update([
                'payment_status' => 'expired'
            ]);
        }

        $this->info(
            $orders->count() .
            ' orders expired'
        );
    }
}