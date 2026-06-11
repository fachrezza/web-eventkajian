<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\TicketType;

use App\Services\MidtransService;

class CheckoutController extends Controller
{
    protected $midtransService;

    public function __construct(
        MidtransService $midtransService
    )
    {
        $this->midtransService = $midtransService;
    }

    public function store(Request $request)
    {
        $request->validate([

            'ticket_type_id' => 'required|exists:ticket_types,id',

            'customer_name' => 'required',

            'customer_email' => 'required|email',

            'customer_phone' => 'required',

            'quantity' => 'required|integer|min:1',

        ]);

        $ticketType = TicketType::findOrFail(
            $request->ticket_type_id
        );

        if ($ticketType->sold >= $ticketType->quota) {

            return response()->json([
                'success' => false,
                'message' => 'Tiket habis'
            ], 400);
        }

        $totalAmount =
            $ticketType->price * $request->quantity;

        $order = Order::create([

            'order_code' =>
                'ORD-' . strtoupper(uniqid()),

            'event_id' => $ticketType->event_id,

            'ticket_type_id' => $ticketType->id,

            'customer_name' => $request->customer_name,

            'customer_email' => $request->customer_email,

            'customer_phone' => $request->customer_phone,

            'quantity' => $request->quantity,

            'total_amount' => $totalAmount,

        ]);

        $snapToken =
            $this->midtransService
                ->createTransaction($order);

        return response()->json([

            'success' => true,

            'snap_token' => $snapToken,

            'order' => $order,

        ]);
    }
}