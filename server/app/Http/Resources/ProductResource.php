<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public static function hasImage(?string $filename): bool
    {
        return ! empty($filename);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'product_id' => $this->product_id,
            'name' => $this->name,
            'brand' => $this->brand,
            'size' => $this->size,
            'sku' => $this->sku,
            'capital_price' => $this->capital_price,
            'selling_price' => $this->selling_price,
            'quantity' => $this->quantity,
            'low_stock_threshold' => $this->low_stock_threshold,
            'has_image' => self::hasImage($this->image),
            'image' => $this->image,
            'is_low_stock' => $this->isLowStock(),
            'profit_margin' => $this->profit_margin,
            'is_deleted' => $this->is_deleted,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
