<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {

            $table->id();

            $table->string('order_code')
                ->unique();

            $table->foreignId('event_id')
                ->constrained();

            $table->foreignId('ticket_type_id')
                ->constrained();

            $table->string('customer_name');

            $table->string('customer_email');

            $table->string('customer_phone');

            $table->integer('quantity');

            $table->decimal('total_amount', 12, 2);

            $table->enum('payment_status', [
                'pending',
                'paid',
                'failed',
                'expired',
                'cancelled'
            ])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};