<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'location',
        'event_date',
        'banner',
        'status',
    ];
    
    public function ticketTypes()
    {
        return $this->hasMany(TicketType::class);
    }
}