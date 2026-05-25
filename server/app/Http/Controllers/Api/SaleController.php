<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Http\Resources\SaleResource;
use App\Models\Sale;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function loadSales(Request $request)
    {
        $search = $request->input('search');
        $from = $request->input('from');
        $to = $request->input('to');

        $sales = Sale::with(['user:user_id,name', 'items.product:product_id,name,brand,size'])
            ->orderByDesc('tbl_sales.sale_date');

        $sales->betweenDates($from, $to);

        if ($search) {
            $sales->whereHas('user', function ($query) use ($search) {
                $query->where('tbl_users.name', 'like', "%{$search}%");
            });
        }

        $sales = $sales->paginate(10);

        return response()->json([
            'sales' => SaleResource::collection($sales)->response()->getData(true),
        ], 200);
    }

    public function storeSale(StoreSaleRequest $request)
    {
        $validated = $request->validated();

        $sale = Sale::recordSale(
            $request->user()->user_id,
            $validated['items'],
            $validated['notes'] ?? null
        );

        return response()->json([
            'message' => 'Sale Successfully Saved.',
            'sale' => new SaleResource($sale),
        ], 200);
    }
}
