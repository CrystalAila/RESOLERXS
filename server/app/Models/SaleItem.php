<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class SaleItem extends Model
{
    protected $table = 'tbl_sale_items';

    protected $primaryKey = 'sale_item_id';

    protected $fillable = [
        'sale_id',
        'product_id',
        'quantity',
        'unit_price',
        'unit_cost',
        'line_profit',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'unit_cost' => 'decimal:2',
            'line_profit' => 'decimal:2',
        ];
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class, 'sale_id', 'sale_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    public static function calculateLineProfit(float $unitPrice, float $unitCost, int $quantity): float
    {
        return ((float) $unitPrice - (float) $unitCost) * $quantity;
    }

    public static function calculateLineTotal(float $unitPrice, int $quantity): float
    {
        return (float) $unitPrice * $quantity;
    }

    /**
     * Best-selling products within a date range.
     */
    public static function bestSellers(string $from, string $to, int $limit = 10): Builder
    {
        return self::query()
            ->join('tbl_sales', 'tbl_sale_items.sale_id', '=', 'tbl_sales.sale_id')
            ->join('tbl_products', 'tbl_sale_items.product_id', '=', 'tbl_products.product_id')
            ->whereBetween(DB::raw('DATE(tbl_sales.sale_date)'), [$from, $to])
            ->select(
                'tbl_products.product_id',
                'tbl_products.name',
                'tbl_products.brand',
                'tbl_products.size',
                DB::raw('SUM(tbl_sale_items.quantity) as units_sold'),
                DB::raw('SUM(tbl_sale_items.quantity * tbl_sale_items.unit_price) as revenue'),
                DB::raw('SUM(tbl_sale_items.line_profit) as profit')
            )
            ->groupBy(
                'tbl_products.product_id',
                'tbl_products.name',
                'tbl_products.brand',
                'tbl_products.size'
            )
            ->orderByDesc('units_sold')
            ->limit($limit);
    }
}
