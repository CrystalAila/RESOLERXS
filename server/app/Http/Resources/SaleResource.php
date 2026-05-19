<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'sale_id' => $this->sale_id,
            'user_id' => $this->user_id,
            'sale_date' => $this->sale_date,
            'total_amount' => $this->total_amount,
            'total_profit' => $this->total_profit,
            'notes' => $this->notes,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'user_id' => $this->user->user_id,
                    'name' => $this->user->name,
                ];
            }),
            'items' => SaleItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
