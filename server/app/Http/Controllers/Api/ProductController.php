<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class ProductController extends Controller
{
    private const IMAGE_DISK = 'local';

    private const IMAGE_PATH = 'products';

    public function loadProducts(Request $request)
    {
        $search = $request->input('search');
        $lowStockOnly = $request->boolean('low_stock');

        $products = Product::active()
            ->orderBy('tbl_products.brand', 'asc')
            ->orderBy('tbl_products.name', 'asc')
            ->orderBy('tbl_products.size', 'asc');

        if ($search) {
            $products->where(function ($query) use ($search) {
                $query->where('tbl_products.name', 'like', "%{$search}%")
                    ->orWhere('tbl_products.brand', 'like', "%{$search}%")
                    ->orWhere('tbl_products.size', 'like', "%{$search}%")
                    ->orWhere('tbl_products.sku', 'like', "%{$search}%");
            });
        }

        if ($lowStockOnly) {
            $products->lowStock();
        }

        $products = $products->paginate(15);

        return response()->json([
            'products' => ProductResource::collection($products)->response()->getData(true),
        ], 200);
    }

    public function loadAllProducts()
    {
        $products = Product::active()
            ->inStock()
            ->orderBy('tbl_products.brand')
            ->orderBy('tbl_products.name')
            ->get();

        return response()->json([
            'products' => ProductResource::collection($products)->resolve(),
        ], 200);
    }

    public function getProductImage(Product $product)
    {
        if (! $product->image || ! Storage::disk(self::IMAGE_DISK)->exists(self::IMAGE_PATH . '/' . $product->image)) {
            return response()->json(['message' => 'Image not found.'], Response::HTTP_NOT_FOUND);
        }

        return Storage::disk(self::IMAGE_DISK)->response(self::IMAGE_PATH . '/' . $product->image);
    }

    public function storeProduct(StoreProductRequest $request)
    {
        $validated = $request->validated();

        $image = $this->storeImage($request, 'product_image');

        Product::create([
            'name' => $validated['name'],
            'brand' => $validated['brand'],
            'size' => $validated['size'],
            'sku' => $validated['sku'] ?? null,
            'capital_price' => $validated['capital_price'],
            'selling_price' => $validated['selling_price'],
            'quantity' => $validated['quantity'],
            'low_stock_threshold' => $validated['low_stock_threshold'],
            'image' => $image,
            'is_deleted' => false,
        ]);

        return response()->json([
            'message' => 'Product Successfully Saved.',
        ], 200);
    }

    public function updateProduct(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validated();

        $image = $product->image;

        if ($request->boolean('remove_image')) {
            $this->deleteImage($product->image);
            $image = null;
        }

        if ($request->hasFile('product_image')) {
            $this->deleteImage($product->image);
            $image = $this->storeImage($request, 'product_image');
        }

        $product->update([
            'name' => $validated['name'],
            'brand' => $validated['brand'],
            'size' => $validated['size'],
            'sku' => $validated['sku'] ?? null,
            'capital_price' => $validated['capital_price'],
            'selling_price' => $validated['selling_price'],
            'quantity' => $validated['quantity'],
            'low_stock_threshold' => $validated['low_stock_threshold'],
            'image' => $image,
        ]);

        return response()->json([
            'message' => 'Product Successfully Updated.',
            'product' => new ProductResource($product->fresh()),
        ], 200);
    }

    public function destroyProduct(Product $product)
    {
        $this->deleteImage($product->image);

        $product->update([
            'is_deleted' => true,
        ]);

        return response()->json([
            'message' => 'Product Successfully Deleted.',
        ], 200);
    }

    private function storeImage(Request $request, string $field): ?string
    {
        if (! $request->hasFile($field)) {
            return null;
        }

        $file = $request->file($field);
        $filenameWithExtension = $file->getClientOriginalName();
        $filename = pathinfo($filenameWithExtension, PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $filenameToStore = sha1($filename . '_' . microtime(true)) . '.' . $extension;

        $file->storeAs(self::IMAGE_PATH, $filenameToStore, self::IMAGE_DISK);

        return $filenameToStore;
    }

    private function deleteImage(?string $filename): void
    {
        if ($filename && Storage::disk(self::IMAGE_DISK)->exists(self::IMAGE_PATH . '/' . $filename)) {
            Storage::disk(self::IMAGE_DISK)->delete(self::IMAGE_PATH . '/' . $filename);
        }
    }
}
