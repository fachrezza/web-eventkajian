<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Ticket;

class DashboardController extends Controller
{
    public function index()
    {
        $paidOrders = Order::where('payment_status', 'paid')->get();

        return response()->json([
            'stats' => [
                'total_orders' => Order::count(),
                'paid_orders' => Order::where('payment_status', 'paid')->count(),
                'pending_orders' => Order::where('payment_status', 'pending')->count(),

                'tickets_sold' => Ticket::count(),
                'attendance' => Ticket::where('status', 'used')->count(),

                'revenue' => Order::where('payment_status', 'paid')
                    ->sum('total_amount'),
            ],

            'charts' => [
                'sales_by_status' => [
                    'paid' => Order::where('payment_status', 'paid')->count(),
                    'pending' => Order::where('payment_status', 'pending')->count(),
                ],
            ]
        ]);
    }
}