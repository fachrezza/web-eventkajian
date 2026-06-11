<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;

class TicketMail extends Mailable
{
    use Queueable;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        $order = $this->order;

        $qrCodes = [];

        foreach ($order->tickets as $ticket) {

            $qrCodes[$ticket->id] = base64_encode(

                QrCode::format('png')
                    ->size(250)
                    ->generate($ticket->qr_token)

            );
        }

        $pdf = Pdf::loadView('pdf.ticket', [

            'order' => $order,

            'qrCodes' => $qrCodes,

        ]);

        return $this->subject('Tiket Event Kajian')
            ->view('emails.ticket')
            ->attachData(
                $pdf->output(),
                "ticket-{$order->order_code}.pdf",
                [
                    'mime' => 'application/pdf',
                ]
            );
    }
}