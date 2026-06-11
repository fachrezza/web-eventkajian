<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [

        'order_id',

        'ticket_code',

        'qr_token',

        'status',

    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function checkin()
    {
        return $this->hasOne(Checkin::class);
    }
}