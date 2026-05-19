<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    protected $table = 'tbl_products';

    protected $primaryKey = 'product_id';

    protected $fillable = [
        'name',
        'brand',
        'size',
        'sku',
        'capital_price',
        'selling_price',
        'quantity',
        'low_stock_threshold',
        'image',
        'is_deleted',
    ];

    protected $appends = [
        'profit_margin',
    ];

    protected function casts(): array
    {
        return [
            'capital_price' => 'decimal:2',
            'selling_price' => 'decimal:2',
            'quantity' => 'integer',
            'low_stock_threshold' => 'integer',
            'is_deleted' => 'boolean',
        ];
    }

    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class, 'product_id', 'product_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('tbl_products.is_deleted', false);
    }

    public function scopeLowStock(Builder $query): Builder
    {
        return $query->whereColumn('tbl_products.quantity', '<=', 'tbl_products.low_stock_threshold');
    }

    public function scopeInStock(Builder $query): Builder
    {
        return $query->where('tbl_products.quantity', '>', 0);
    }

    public function isLowStock(): bool
    {
        return $this->quantity <= $this->low_stock_threshold;
    }

    public function getProfitMarginAttribute(): float
    {
        return (float) $this->selling_price - (float) $this->capital_price;
    }

    public static function calculateLineProfit(float $sellingPrice, float $capitalPrice, int $quantity): float
    {
        return ((float) $sellingPrice - (float) $capitalPrice) * $quantity;
    }

    public function reduceStock(int $quantity): void
    {
        if ($this->quantity < $quantity) {
            throw new \RuntimeException(
                "Insufficient stock for {$this->name} ({$this->brand} - Size {$this->size})."
            );
        }

        $this->decrement('quantity', $quantity);
    }
}
