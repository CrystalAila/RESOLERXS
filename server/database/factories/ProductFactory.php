<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Converse', 'Jordan'];
        $sizes = ['6', '7', '8', '9', '10', '11', '12'];
        $capital = fake()->randomFloat(2, 800, 3500);
        $selling = $capital + fake()->randomFloat(2, 300, 1500);

        return [
            'name' => fake()->randomElement(['Air Max', 'Dunk Low', 'Ultraboost', 'Classic Leather', 'RS-X', 'Chuck 70']),
            'brand' => fake()->randomElement($brands),
            'size' => fake()->randomElement($sizes),
            'sku' => strtoupper(fake()->unique()->bothify('RX-####-??')),
            'capital_price' => $capital,
            'selling_price' => $selling,
            'quantity' => fake()->numberBetween(0, 40),
            'low_stock_threshold' => 5,
            'image' => null,
            'is_deleted' => false,
        ];
    }
}
