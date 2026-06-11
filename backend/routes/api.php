<?php

use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\TicketScanController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AttendanceController;

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