<!DOCTYPE html>
<html>
<head>
    <title>Tiket Event</title>
</head>

<body>

    <h1>TIKET EVENT KAJIAN</h1>

    <p>Order: {{ $order->order_code }}</p>

    <p>Nama: {{ $order->customer_name }}</p>

    <p>Email: {{ $order->customer_email }}</p>

    <hr>

    <h3>TIKET:</h3>

    @foreach($order->tickets as $ticket)


        <div style="margin-top:20px;">

            <img
                src="data:image/png;base64,{{ $qrCodes[$ticket->id] }}"
                width="180"
            >
             <p>
                {{ $ticket->ticket_code }}
            </p>
        </div>
        

        <br>

    @endforeach

</body>
</html>