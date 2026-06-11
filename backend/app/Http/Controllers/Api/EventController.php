<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;

class EventController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Event::latest()->get()
        ]);
    }

    public function show($id)
    {
        $event = Event::findOrFail($id);

        return response()->json($event);
    }
}