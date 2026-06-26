<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;

class EventController extends Controller
{
    // LIST EVENT
    public function index()
    {
        $events = Event::with('ticketTypes')
            ->latest()
            ->get();

        return response()->json($events);
    }

    // DETAIL EVENT
    public function show($id)
    {
        $event = Event::with('ticketTypes')
            ->findOrFail($id);

        return response()->json($event);
    }
}