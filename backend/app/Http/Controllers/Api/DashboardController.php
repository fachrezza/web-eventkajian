<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Order;
use App\Models\Ticket;

use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        /*
        |--------------------------------------------------------------------------
        | STATS
        |--------------------------------------------------------------------------
        */

        $totalOrders = Order::count();

        $paidOrders = Order::where(
            'payment_status',
            'paid'
        )->count();

        $pendingOrders = Order::where(
            'payment_status',
            'pending'
        )->count();

        $failedOrders = Order::where(
            'payment_status',
            'failed'
        )->count();

        $expiredOrders = Order::where(
            'payment_status',
            'expired'
        )->count();

        $ticketsSold = Ticket::count();

        $attendance = Ticket::where(
            'status',
            'used'
        )->count();

        $revenue = Order::where(
            'payment_status',
            'paid'
        )->sum('total_amount');

        /*
        |--------------------------------------------------------------------------
        | SALES CHART
        |--------------------------------------------------------------------------
        */

        $salesChart = Order::select(

                DB::raw('DATE(created_at) as date'),

                DB::raw('SUM(total_amount) as total')

            )
            ->where('payment_status', 'paid')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | SALES STATUS CHART
        |--------------------------------------------------------------------------
        */

        $salesByStatus = [

            'paid' => $paidOrders,

            'pending' => $pendingOrders,

            'failed' => $failedOrders,

            'expired' => $expiredOrders,

        ];

        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return response()->json([

            'success' => true,

            'stats' => [

                'total_orders' => $totalOrders,

                'paid_orders' => $paidOrders,

                'pending_orders' => $pendingOrders,

                'failed_orders' => $failedOrders,

                'expired_orders' => $expiredOrders,

                'tickets_sold' => $ticketsSold,

                'attendance' => $attendance,

                'revenue' => $revenue,

            ],

            'charts' => [

                'sales_by_status' => $salesByStatus,

                'sales_chart' => $salesChart,

            ]

        ]);
    }
}