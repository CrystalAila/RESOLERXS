<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Air Jordan 1 Retro High OG',
                'brand' => 'Jordan',
                'size' => '10',
                'sku' => 'RX-JRD-001',
                'capital_price' => 6500.00,
                'selling_price' => 8990.00,
                'quantity' => 8,
                'low_stock_threshold' => 3,
            ],
            [
                'name' => 'Air Jordan 4 Retro',
                'brand' => 'Jordan',
                'size' => '9',
                'sku' => 'RX-JRD-002',
                'capital_price' => 7200.00,
                'selling_price' => 9990.00,
                'quantity' => 5,
                'low_stock_threshold' => 3,
            ],
            [
                'name' => 'Dunk Low Retro',
                'brand' => 'Nike',
                'size' => '8',
                'sku' => 'RX-NKE-001',
                'capital_price' => 4800.00,
                'selling_price' => 6490.00,
                'quantity' => 12,
                'low_stock_threshold' => 4,
            ],
            [
                'name' => 'Air Max 90',
                'brand' => 'Nike',
                'size' => '11',
                'sku' => 'RX-NKE-002',
                'capital_price' => 4200.00,
                'selling_price' => 5790.00,
                'quantity' => 10,
                'low_stock_threshold' => 4,
            ],
            [
                'name' => "Air Force 1 '07",
                'brand' => 'Nike',
                'size' => '10',
                'sku' => 'RX-NKE-003',
                'capital_price' => 3800.00,
                'selling_price' => 5290.00,
                'quantity' => 15,
                'low_stock_threshold' => 5,
            ],
            [
                'name' => 'Ultraboost 22',
                'brand' => 'Adidas',
                'size' => '9',
                'sku' => 'RX-ADS-001',
                'capital_price' => 5500.00,
                'selling_price' => 7490.00,
                'quantity' => 7,
                'low_stock_threshold' => 3,
            ],
            [
                'name' => 'Samba OG',
                'brand' => 'Adidas',
                'size' => '8',
                'sku' => 'RX-ADS-002',
                'capital_price' => 3200.00,
                'selling_price' => 4590.00,
                'quantity' => 14,
                'low_stock_threshold' => 5,
            ],
            [
                'name' => '550',
                'brand' => 'New Balance',
                'size' => '9',
                'sku' => 'RX-NB-001',
                'capital_price' => 3500.00,
                'selling_price' => 4990.00,
                'quantity' => 9,
                'low_stock_threshold' => 4,
            ],
            [
                'name' => 'Chuck 70 High',
                'brand' => 'Converse',
                'size' => '8',
                'sku' => 'RX-CNV-001',
                'capital_price' => 2800.00,
                'selling_price' => 3990.00,
                'quantity' => 11,
                'low_stock_threshold' => 4,
            ],
            [
                'name' => 'RS-X Reinvention',
                'brand' => 'Puma',
                'size' => '10',
                'sku' => 'RX-PMA-001',
                'capital_price' => 2900.00,
                'selling_price' => 4290.00,
                'quantity' => 2,
                'low_stock_threshold' => 5,
            ],
        ];

        foreach ($products as $product) {
            Product::create([
                ...$product,
                'image' => null,
                'is_deleted' => false,
            ]);
        }
    }
}
