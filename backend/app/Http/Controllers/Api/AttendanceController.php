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
        $request->validate([
            'token' => 'required'
        ]);

        $ticket = Ticket::where(
            'qr_token',
            $request->token
        )->first();

        if (!$ticket) {

            return response()->json([

                'success' => false,

                'message' => 'Ticket tidak valid'

            ], 404);
        }

        if ($ticket->status === 'used') {

            return response()->json([

                'success' => false,

                'message' => 'Ticket sudah digunakan'

            ], 400);
        }

        $ticket->update([
            'status' => 'used'
        ]);

        Checkin::create([

            'ticket_id' => $ticket->id,

            'user_id' => auth()->id(),

            'checkin_time' => now(),

        ]);

        return response()->json([

            'success' => true,

            'message' => 'Checkin berhasil',

            'ticket' => $ticket,

        ]);
    }
}