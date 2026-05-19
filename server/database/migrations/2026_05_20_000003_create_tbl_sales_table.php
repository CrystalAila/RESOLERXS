<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_sales', function (Blueprint $table) {
            $table->id('sale_id');
            $table->foreignId('user_id')->constrained('tbl_users', 'user_id')->cascadeOnUpdate()->restrictOnDelete();
            $table->dateTime('sale_date');
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->decimal('total_profit', 12, 2)->default(0);
            $table->string('notes', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_sales');
    }
};
