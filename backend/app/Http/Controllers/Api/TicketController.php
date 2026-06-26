<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TicketController extends Controller
{
    public function download($token)
    {
        $ticket = Ticket::where(
            'qr_token',
            $token
        )
        ->with([
            'order',
            'order.event',
            'order.ticketType',
        ])
        ->firstOrFail();

        $order = $ticket->order;

        $qrCodes = [];

        foreach ($order->tickets as $t) {

            $qrCodes[$t->id] =
                base64_encode(

                    QrCode::format('png')
                        ->size(300)
                        ->generate($t->qr_token)

                );
        }

        $pdf = Pdf::loadView(
            'pdf.ticket',
            [
                'ticket' => $ticket,
                'order' => $order,
                'qrCodes' => $qrCodes,
            ]
        );

        return $pdf->download(
            'ticket-'.$ticket->ticket_code.'.pdf'
        );
    }
}