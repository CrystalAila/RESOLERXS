<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'sale_item_id' => $this->sale_item_id,
            'sale_id' => $this->sale_id,
            'product_id' => $this->product_id,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'unit_cost' => $this->unit_cost,
            'line_profit' => $this->line_profit,
            'product' => $this->whenLoaded('product', function () {
                return [
                    'product_id' => $this->product->product_id,
                    'name' => $this->product->name,
                    'brand' => $this->product->brand,
                    'size' => $this->product->size,
                ];
            }),
        ];
    }
}
