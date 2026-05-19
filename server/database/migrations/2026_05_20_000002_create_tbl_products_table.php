<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_products', function (Blueprint $table) {
            $table->id('product_id');
            $table->string('name', 120);
            $table->string('brand', 80);
            $table->string('size', 20);
            $table->string('sku', 50)->nullable()->unique();
            $table->decimal('capital_price', 12, 2);
            $table->decimal('selling_price', 12, 2);
            $table->unsignedInteger('quantity')->default(0);
            $table->unsignedInteger('low_stock_threshold')->default(5);
            $table->string('image', 255)->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_products');
    }
};
