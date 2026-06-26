<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Jobs\SendTicketEmailJob;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Ticket;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;



class PaymentController extends Controller
{
    public function webhook(Request $request)
    {
        DB::beginTransaction();

        try {

            $payload = $request->all();

            Log::info(
                'MIDTRANS WEBHOOK',
                $payload
            );

            /*
            |--------------------------------------------------------------------------
            | VALIDASI PAYLOAD
            |--------------------------------------------------------------------------
            */

            if (!isset($payload['order_id'])) {

                return response()->json([
                    'message' =>
                        'order_id tidak ada'
                ], 400);
            }

            /*
            |--------------------------------------------------------------------------
            | VALIDASI SIGNATURE
            |--------------------------------------------------------------------------
            */

            $signatureKey = hash(

                'sha512',

                $payload['order_id'] .
                $payload['status_code'] .
                $payload['gross_amount'] .
                env('MIDTRANS_SERVER_KEY')

            );

            if (
                !isset($payload['signature_key']) ||

                $signatureKey !==
                $payload['signature_key']
            ) {

                Log::warning(
                    'INVALID SIGNATURE',
                    $payload
                );

                return response()->json([
                    'message' =>
                        'Invalid signature'
                ], 403);
            }

            /*
            |--------------------------------------------------------------------------
            | FIND ORDER
            |--------------------------------------------------------------------------
            */

            $order = Order::where(
                'order_code',
                $payload['order_id']
            )->first();

            if (!$order) {

                return response()->json([
                    'message' =>
                        'Order tidak ditemukan'
                ], 404);
            }

            /*
            |--------------------------------------------------------------------------
            | CEK DUPLIKAT PAYMENT LOG
            |--------------------------------------------------------------------------
            */

            $paymentExists = Payment::where(
                'transaction_id',
                $payload['transaction_id'] ?? ''
            )->exists();

            if (!$paymentExists) {

                Payment::create([

                    'order_id' =>
                        $order->id,

                    'provider' =>
                        'midtrans',

                    'transaction_id' =>
                        $payload['transaction_id']
                        ?? null,

                    'payment_type' =>
                        $payload['payment_type']
                        ?? null,

                    'gross_amount' =>
                        $payload['gross_amount']
                        ?? 0,

                    'transaction_status' =>
                        $payload['transaction_status']
                        ?? null,

                    'raw_response' =>
                        json_encode($payload),

                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | PAYMENT SUCCESS
            |--------------------------------------------------------------------------
            */

            if (
                in_array(
                    $payload['transaction_status'],
                    ['settlement', 'capture']
                )
            ) {

                /*
                |--------------------------------------------------------------------------
                | EXPIRED
                |--------------------------------------------------------------------------
                */

                if (
                    $order->payment_status ===
                    'expired'
                ) {

                    return response()->json([
                        'message' =>
                            'Order expired'
                    ], 400);
                }

                /*
                |--------------------------------------------------------------------------
                | ALREADY PAID
                |--------------------------------------------------------------------------
                */

                if (
                    $order->payment_status ===
                    'paid'
                ) {

                    return response()->json([
                        'message' =>
                            'Already paid'
                    ]);
                }

                /*
                |--------------------------------------------------------------------------
                | UPDATE PAID
                |--------------------------------------------------------------------------
                */

                $order->update([
                    'payment_status' => 'paid'
                ]);

                Http::post(
                    config('services.google_sheet_webhook'),
                    [

                        'source' =>
                            'web',

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

                        'total_amount' =>
                            $order->total_amount,

                        'payment_status' =>
                            $order->payment_status,
                    ]
                );

                /*
                |--------------------------------------------------------------------------
                | GENERATE TICKET
                |--------------------------------------------------------------------------
                */

                if (
                    $order->tickets()->count() === 0
                ) {

                    for (
                        $i = 1;
                        $i <= $order->quantity;
                        $i++
                    ) {

                        Ticket::create([

                            'order_id' =>
                                $order->id,

                            'ticket_code' =>
                                'TKT-' .
                                strtoupper(
                                    Str::random(10)
                                ),

                            'qr_token' =>
                                Str::uuid(),

                            'status' =>
                                'active',

                        ]);
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | UPDATE SOLD
                |--------------------------------------------------------------------------
                */

                if ($order->ticketType) {

                    $order->ticketType
                        ->increment(
                            'sold',
                            $order->quantity
                        );
                }

                /*
                |--------------------------------------------------------------------------
                | SEND EMAIL
                |--------------------------------------------------------------------------
                */

                SendTicketEmailJob::dispatch(
                    $order
                );

                Log::info(
                    'PAYMENT SUCCESS',
                    [
                        'order_id' =>
                            $order->id
                    ]
                );
            }

            /*
            |--------------------------------------------------------------------------
            | PAYMENT EXPIRED
            |--------------------------------------------------------------------------
            */

            elseif (
                $payload['transaction_status']
                === 'expire'
            ) {

                $order->update([
                    'payment_status' =>
                        'expired'
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | PAYMENT FAILED
            |--------------------------------------------------------------------------
            */

            elseif (
                in_array(
                    $payload['transaction_status'],
                    ['deny', 'cancel']
                )
            ) {

                $order->update([
                    'payment_status' =>
                        'failed'
                ]);
            }

            DB::commit();

            return response()->json([

                'success' => true,

                'message' =>
                    'Webhook processed'

            ]);
        }

        catch (\Exception $e) {

            DB::rollBack();

            Log::error(
                'WEBHOOK ERROR',
                [
                    'message' =>
                        $e->getMessage()
                ]
            );

            return response()->json([

                'success' => false,

                'message' =>
                    $e->getMessage()

            ], 500);
        }
    }
}