<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp'],
            'name' => ['required', 'max:120'],
            'brand' => ['required', 'max:80'],
            'size' => ['required', 'max:20'],
            'sku' => ['nullable', 'max:50', Rule::unique('tbl_products', 'sku')],
            'capital_price' => ['required', 'numeric', 'min:0'],
            'selling_price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['required', 'integer', 'min:0'],
        ];
    }
}
