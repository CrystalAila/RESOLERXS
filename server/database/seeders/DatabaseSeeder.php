<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'RESOLERXS Admin',
            'username' => 'resolerxs',
            'password' => 'resolerxs',
            'role' => 'admin',
        ]);

        $this->call(ProductSeeder::class);

        $products = Product::where('is_deleted', false)->where('quantity', '>', 0)->take(3)->get();

        foreach ($products as $product) {
            $qty = min(1, $product->quantity);
            $lineProfit = ((float) $product->selling_price - (float) $product->capital_price) * $qty;
            $lineTotal = (float) $product->selling_price * $qty;

            $sale = Sale::create([
                'user_id' => $admin->user_id,
                'sale_date' => now()->subDays(rand(0, 7)),
                'total_amount' => $lineTotal,
                'total_profit' => $lineProfit,
                'notes' => 'Sample seeded sale',
            ]);

            SaleItem::create([
                'sale_id' => $sale->sale_id,
                'product_id' => $product->product_id,
                'quantity' => $qty,
                'unit_price' => $product->selling_price,
                'unit_cost' => $product->capital_price,
                'line_profit' => $lineProfit,
            ]);

            $product->decrement('quantity', $qty);
        }
    }
}
