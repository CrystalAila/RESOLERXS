<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_sale_items', function (Blueprint $table) {
            $table->id('sale_item_id');
            $table->foreignId('sale_id')->constrained('tbl_sales', 'sale_id')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('tbl_products', 'product_id')->cascadeOnUpdate()->restrictOnDelete();
            $table->unsignedInteger('quantity');
            $table->decimal('unit_price', 12, 2);
            $table->decimal('unit_cost', 12, 2);
            $table->decimal('line_profit', 12, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_sale_items');
    }
};
