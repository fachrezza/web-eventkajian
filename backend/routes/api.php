<?php

use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\TicketScanController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\TicketTypeController;
use Illuminate\Support\Facades\Http;

Route::get('/test-sheet', function () {

    $response = Http::post(
        env('GOOGLE_SHEET_WEBHOOK'),
        [

            'order_code' => 'TEST-001',

            'customer_name' => 'EXGaming',

            'customer_email' => 'test@gmail.com',

            'customer_phone' => '08123456789',

            'ticket_name' => 'VIP',

            'quantity' => 2,

            'payment_status' => 'paid',

        ]
    );

    return $response->body();
});

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/ticket-types', [TicketTypeController::class, 'index']);
    Route::put('/ticket-types/{id}', [TicketTypeController::class, 'update']);

});

Route::get(
    '/tickets/download/{token}',
    [TicketController::class, 'download']
);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/orders', [OrderController::class, 'index']);

    Route::post(
        '/orders/{id}/checkin',
        [OrderController::class, 'manualCheckin']
    );
    Route::post(
        '/orders/manual',
        [OrderController::class, 'storeManual']
    );

});

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/attendance/scan', [
        AttendanceController::class,
        'scan'
    ]);

});

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::post('/checkout', [CheckoutController::class, 'store']);
Route::post('/payment/webhook', [
    PaymentController::class,
    'webhook'
]);

Route::get('/test-qr', function () {

    return QrCode::size(300)
        ->generate('TEST QR');
});
Route::post('/scan-ticket', [TicketScanController::class, 'scan']);
Route::get('/attendance', [TicketScanController::class, 'index']);

Route::post('/login', [LoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
Route::get('/test-paid/{order}', function ($orderId) {
    $order = \App\Models\Order::find($orderId);

    $order->update([
        'payment_status' => 'paid'
    ]);

    return 'ok';
});