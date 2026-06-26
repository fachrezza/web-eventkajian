<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\Order;
use App\Models\Checkin;
use Illuminate\Support\Facades\Http;

use Illuminate\Http\Request;

class OrderController extends Controller
{
    // ================= GET ALL ORDERS =================
    public function index()
    {
        $orders = Order::with([
            'event',
            'ticketType',
            'tickets.checkin',
            'payments',
        ])
        ->latest()
        ->get();

        return response()->json([

            'success' => true,

            'data' => $orders

        ]);
    }

    // ================= MANUAL CHECK-IN =================
    public function manualCheckin($id)
    {
        $order = Order::with([
            'tickets.checkin'
        ])->findOrFail($id);

        foreach ($order->tickets as $ticket) {

            // kalau sudah checkin skip
            if ($ticket->checkin) {
                continue;
            }

            // update ticket
            $ticket->update([
                'status' => 'used'
            ]);

            // create checkin
            Checkin::create([
                'ticket_id' => $ticket->id,
                'user_id' => auth()->id(),
                'checkin_time' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Check-in berhasil'
        ]);
    }

    public function storeManual(Request $request)
    {
        $request->validate([

            'ticket_type_id' => 'required',

            'customer_name' => 'required',

            'customer_email' => 'required',

            'customer_phone' => 'required',

            'quantity' => 'required|integer|min:1',

        ]);

        // ticket type
        $ticketType = TicketType::findOrFail(
            $request->ticket_type_id
        );

        // total
        $total =
            $ticketType->price *
            $request->quantity;

        // create order
        $order = Order::create([

            'order_code' =>
                'ORD-' . strtoupper(Str::random(8)),

            'event_id' =>
                $ticketType->event_id,

            'ticket_type_id' =>
                $ticketType->id,

            'customer_name' =>
                $request->customer_name,

            'customer_email' =>
                $request->customer_email,

            'customer_phone' =>
                $request->customer_phone,

            'quantity' =>
                $request->quantity,

            'total_amount' =>
                $total,

            'payment_status' =>
                'paid',

            'source' =>
                'manual',
                
            'expired_at' =>
            now()->addMinutes(30),
        ]);

        // generate tickets
        for ($i = 0; $i < $request->quantity; $i++) {

            Ticket::create([

                'order_id' => $order->id,

                'ticket_code' =>
                    strtoupper(Str::random(10)),

                'qr_token' =>
                    Str::uuid(),

                'status' => 'active',

            ]);
        }

        // update sold
        $ticketType->increment(
            'sold',
            $request->quantity
        );
        Http::post(
            config('services.google_sheet_webhook'),
            [

                'source' =>
                    'manual',

                'order_code' =>
                    $order->order_code,

                'customer_name' =>
                    $order->customer_name,

                'customer_email' =>
                    $order->customer_email,

                'customer_phone' =>
                    $order->customer_phone,

                'ticket_name' =>
                    $ticketType->name,

                'quantity' =>
                    $order->quantity,

                'total_amount' =>
                    $order->total_amount,

                'payment_status' =>
                    'paid',
            ]
        );

        return response()->json([

            'message' => 'Manual order berhasil',

            'order' => $order,

        ]);
        
    }
}