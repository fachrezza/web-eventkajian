<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketType extends Model
{
    protected $fillable = [
        'event_id',
        'name',
        'description',
        'price',
        'quota',
        'sold',
        'max_per_order',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}