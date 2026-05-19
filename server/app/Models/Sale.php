<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class Sale extends Model
{
    protected $table = 'tbl_sales';

    protected $primaryKey = 'sale_id';

    protected $fillable = [
        'user_id',
        'sale_date',
        'total_amount',
        'total_profit',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'sale_date' => 'datetime',
            'total_amount' => 'decimal:2',
            'total_profit' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class, 'sale_id', 'sale_id');
    }

    public function scopeBetweenDates(Builder $query, ?string $from, ?string $to): Builder
    {
        if ($from) {
            $query->whereDate('tbl_sales.sale_date', '>=', $from);
        }

        if ($to) {
            $query->whereDate('tbl_sales.sale_date', '<=', $to);
        }

        return $query;
    }

    /**
     * Record a sale, reduce stock, and calculate profit automatically.
     *
     * @param  array<int, array{product_id: int, quantity: int}>  $items
     */
    public static function recordSale(int $userId, array $items, ?string $notes = null): self
    {
        return DB::transaction(function () use ($userId, $items, $notes) {
            $totalAmount = 0;
            $totalProfit = 0;
            $lineItems = [];

            foreach ($items as $item) {
                $product = Product::active()
                    ->where('tbl_products.product_id', $item['product_id'])
                    ->lockForUpdate()
                    ->first();

                if (! $product) {
                    throw ValidationException::withMessages([
                        'items' => ['One or more products are unavailable.'],
                    ]);
                }

                if ($product->quantity < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => ["Insufficient stock for {$product->name} ({$product->brand} - Size {$product->size})."],
                    ]);
                }

                $unitPrice = (float) $product->selling_price;
                $unitCost = (float) $product->capital_price;
                $lineProfit = SaleItem::calculateLineProfit($unitPrice, $unitCost, $item['quantity']);
                $lineTotal = SaleItem::calculateLineTotal($unitPrice, $item['quantity']);

                $totalAmount += $lineTotal;
                $totalProfit += $lineProfit;

                $lineItems[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'unit_cost' => $unitCost,
                    'line_profit' => $lineProfit,
                ];
            }

            $sale = self::create([
                'user_id' => $userId,
                'sale_date' => now(),
                'total_amount' => $totalAmount,
                'total_profit' => $totalProfit,
                'notes' => $notes,
            ]);

            foreach ($lineItems as $line) {
                SaleItem::create([
                    'sale_id' => $sale->sale_id,
                    'product_id' => $line['product']->product_id,
                    'quantity' => $line['quantity'],
                    'unit_price' => $line['unit_price'],
                    'unit_cost' => $line['unit_cost'],
                    'line_profit' => $line['line_profit'],
                ]);

                $line['product']->reduceStock($line['quantity']);
            }

            return $sale->load([
                'user:user_id,name',
                'items.product:product_id,name,brand,size',
            ]);
        });
    }
}
