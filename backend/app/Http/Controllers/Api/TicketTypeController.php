<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TicketType;
use Illuminate\Http\Request;

class TicketTypeController extends Controller
{
    public function index()
    {
        return TicketType::all()->map(function ($t) {
            return [
                'id' => $t->id,
                'name' => $t->name,
                'price' => $t->price,
                'quota' => $t->quota,
                'sold' => $t->sold,
                'available' => $t->quota - $t->sold,
                'is_closed' => $t->sold >= $t->quota,
            ];
        });
    }

    public function update(Request $request, $id)
    {
        $ticket = TicketType::findOrFail($id);

        $ticket->update([
            'quota' => $request->quota ?? $ticket->quota,
            'price' => $request->price ?? $ticket->price,
            'is_closed' => $request->is_closed ?? $ticket->is_closed,
        ]);

        return response()->json([
            'message' => 'Ticket updated successfully',
            'data' => [
                'id' => $ticket->id,
                'name' => $ticket->name,
                'price' => $ticket->price,
                'quota' => $ticket->quota,
                'sold' => $ticket->sold,
                'available' => $ticket->quota - $ticket->sold,
                'is_closed' => $ticket->is_closed,
            ]
        ]);
    }
}