<!DOCTYPE html>
<html>
<head>
    <title>Tiket Event</title>

    <style>

        body{
            font-family: sans-serif;
            background:#f8fafc;
            padding:30px;
        }

        .ticket{

            background:white;

            border-radius:20px;

            overflow:hidden;

            margin-bottom:30px;

            border:1px solid #eee;
        }

        .header{

            background:linear-gradient(
                90deg,
                #ec4899,
                #f9a8d4
            );

            color:white;

            padding:25px;
        }

        .title{

            font-size:28px;

            font-weight:bold;
        }

        .subtitle{

            margin-top:5px;

            opacity:0.9;
        }

        .content{

            padding:25px;
        }

        .row{

            margin-bottom:10px;
        }

        .label{

            font-weight:bold;

            color:#555;
        }

        .ticket-type{

            display:inline-block;

            padding:8px 14px;

            border-radius:999px;

            font-size:12px;

            font-weight:bold;

            color:white;
        }

        .vip{
            background:#ec4899;
        }

        .regular{
            background:#10b981;
        }

        .qr{

            text-align:center;

            margin-top:30px;
        }

        .code{

            margin-top:10px;

            font-size:18px;

            font-weight:bold;

            letter-spacing:2px;
        }

        .footer{

            margin-top:20px;

            font-size:12px;

            color:#777;

            text-align:center;
        }

    </style>

</head>

<body>

@foreach($order->tickets as $ticket)

<div class="ticket">

    {{-- HEADER --}}
    <div class="header">

        <div class="title">
            {{ $order->event->title }}
        </div>

        <div class="subtitle">
            Tiket Resmi Event Kajian
        </div>

    </div>

    {{-- CONTENT --}}
    <div class="content">

        <div class="row">
            <span class="label">Order Code:</span>
            {{ $order->order_code }}
        </div>

        <div class="row">
            <span class="label">Nama:</span>
            {{ $order->customer_name }}
        </div>

        <div class="row">
            <span class="label">Email:</span>
            {{ $order->customer_email }}
        </div>

        <div class="row">
            <span class="label">No HP:</span>
            {{ $order->customer_phone }}
        </div>

        <div class="row">
            <span class="label">Tanggal Event:</span>
            {{ $order->event->event_date }}
        </div>

        <div class="row">
            <span class="label">Lokasi:</span>
            {{ $order->event->location }}
        </div>

        <div class="row">

            <span class="label">
                Jenis Tiket:
            </span>

            @php
                $type =
                strtolower(
                    $order->ticketType->name
                );
            @endphp

            <span class="ticket-type {{ $type }}">
                {{ $order->ticketType->name }}
            </span>

        </div>

        {{-- QR --}}
        <div class="qr">

            <img
                src="data:image/png;base64,{{ $qrCodes[$ticket->id] }}"
                width="220"
            >

            <div class="code">
                {{ $ticket->ticket_code }}
            </div>

        </div>

        <div class="footer">

            Mohon tunjukkan QR ini saat check-in acara.

            <br><br>

            Jazakumullahu khairan 🙏

        </div>

    </div>

</div>

@endforeach

</body>
</html>