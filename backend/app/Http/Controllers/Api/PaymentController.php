<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Jobs\SendTicketEmailJob;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Ticket;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function webhook(Request $request)
    {
        $payload = $request->all();

        // 🔥 LOG BIAR KELIHATAN ISINYA
        \Log::info('WEBHOOK MASUK', $payload);

        // ❗ VALIDASI AMAN (BIAR TIDAK ERROR)
        if (!isset($payload['order_id'])) {
            return response()->json([
                'message' => 'order_id tidak ada di payload',
                'debug' => $payload
            ], 400);
        }

        if (!isset($payload['signature_key'])) {
            return response()->json([
                'message' => 'signature_key tidak ada'
            ], 400);
        }

        // 🔐 VALIDASI SIGNATURE MIDTRANS
        $signatureKey = hash(
            'sha512',
            $payload['order_id'] .
            $payload['status_code'] .
            $payload['gross_amount'] .
            env('MIDTRANS_SERVER_KEY')
        );

        if (!isset($payload['signature_key']) || $signatureKey !== $payload['signature_key']) {
            Log::warning('SIGNATURE INVALID', $payload);

            return response()->json([
                'message' => 'Invalid signature'
            ], 403);
        }

        // 🔍 CARI ORDER
        $order = Order::where('order_code', $payload['order_id'])->first();

        if (!$order) {
            Log::warning('ORDER TIDAK DITEMUKAN', $payload);

            return response()->json([
                'success' => false,
                'message' => 'Order tidak ditemukan'
            ], 404);
        }

        // 💾 SIMPAN PAYMENT LOG
        Payment::create([
            'order_id' => $order->id,
            'provider' => 'midtrans',
            'transaction_id' => $payload['transaction_id'] ?? null,
            'payment_type' => $payload['payment_type'] ?? null,
            'gross_amount' => $payload['gross_amount'] ?? 0,
            'transaction_status' => $payload['transaction_status'] ?? null,
            'raw_response' => json_encode($payload),
        ]);

        // 💥 STATUS SUCCESS (INI YANG KRUSIAL)
        if (in_array($payload['transaction_status'], ['settlement', 'capture'])) {

            // 🟢 UPDATE ORDER PAID
            $order->update([
                'payment_status' => 'paid'
            ]);

            // 🎟 CEK BIAR TIDAK DUPLIKAT TICKET
            if ($order->tickets()->count() === 0) {

                for ($i = 1; $i <= $order->quantity; $i++) {

                    Ticket::create([
                        'order_id' => $order->id,
                        'ticket_code' => 'TKT-' . strtoupper(Str::random(10)),
                        'qr_token' => Str::uuid(),
                        'status' => 'active',
                    ]);
                }
            }

            // 📈 UPDATE SOLD
            $order->ticketType->increment('sold', $order->quantity);

            // 📧 SEND EMAIL (QUEUE)
            SendTicketEmailJob::dispatch($order);

            Log::info('ORDER SUCCESS PAID', [
                'order_id' => $order->id
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Webhook processed'
        ]);
    }
}