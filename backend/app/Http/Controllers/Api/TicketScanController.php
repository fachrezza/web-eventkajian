<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ticket;

class TicketScanController extends Controller
{

    public function scan(Request $request)
    {
        $request->validate([
            'qr_token' => 'required|uuid'
        ]);

        $ticket = Ticket::where('qr_token', $request->qr_token)->first();

        if (!$ticket) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ticket tidak ditemukan'
            ], 404);
        }

        if ($ticket->status === 'used') {
            return response()->json([
                'status' => 'error',
                'message' => 'Ticket sudah digunakan'
            ], 409);
        }

        if ($ticket->status !== 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Ticket tidak valid'
            ], 403);
        }

        $order = $ticket->order;

        if (!$order || $order->payment_status !== 'paid') {
            return response()->json([
                'status' => 'error',
                'message' => 'Ticket belum valid / belum dibayar'
            ], 403);
        }

        $ticket->update([
            'status' => 'used'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Check-in berhasil'
        ]);
    }


    public function index()
    {
        $tickets = Ticket::with('order')
            ->latest()
            ->get();

        $total = $tickets->count();
        $checkedIn = $tickets->where('status', 'used')->count();
        $notCheckedIn = $tickets->where('status', 'active')->count();

        return response()->json([
            'summary' => [
                'total' => $total,
                'checked_in' => $checkedIn,
                'not_checked_in' => $notCheckedIn,
            ],
            'data' => $tickets
        ]);
    }
}