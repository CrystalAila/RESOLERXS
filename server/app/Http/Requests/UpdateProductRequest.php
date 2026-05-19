<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('sku') && $this->input('sku') === '') {
            $this->merge(['sku' => null]);
        }
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->product_id;

        return [
            'product_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp'],
            'name' => ['required', 'max:120'],
            'brand' => ['required', 'max:80'],
            'size' => ['required', 'max:20'],
            'sku' => ['nullable', 'max:50', Rule::unique('tbl_products', 'sku')->ignore($productId, 'product_id')],
            'capital_price' => ['required', 'numeric', 'min:0'],
            'selling_price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['required', 'integer', 'min:0'],
        ];
    }
}
