<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Ticket;
use App\Models\Checkin;

class AttendanceController extends Controller
{
    public function scan(Request $request)
    {
        // VALIDASI
        $request->validate([
            'token' => 'required'
        ]);

        // CARI TICKET BERDASARKAN QR TOKEN
        $ticket = Ticket::with('order')
            ->where('qr_token', $request->token)
            ->first();

        // TICKET TIDAK ADA
        if (!$ticket) {

            return response()->json([
                'message' => 'Ticket tidak ditemukan'
            ], 404);

        }

        // SUDAH CHECK-IN
        if ($ticket->status === 'used') {

            return response()->json([
                'message' => 'Ticket sudah digunakan'
            ], 400);

        }

        // UPDATE STATUS
        $ticket->update([
            'status' => 'used'
        ]);

        // SIMPAN CHECKIN
        Checkin::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'checkin_time' => now(),
        ]);

        return response()->json([

            'message' => 'Check-in berhasil',

            'customer' => $ticket->order->customer_name,

            'ticket_code' => $ticket->ticket_code,

        ]);
    }
}