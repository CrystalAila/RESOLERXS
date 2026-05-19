<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SaleResource;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function dashboard()
    {
        $today = now()->toDateString();

        $totalProducts = Product::active()->count();
        $lowStockCount = Product::active()->lowStock()->count();

        $inventoryValue = Product::active()
            ->selectRaw('SUM(tbl_products.capital_price * tbl_products.quantity) as value')
            ->value('value') ?? 0;

        $todaySales = Sale::whereDate('tbl_sales.sale_date', $today);
        $todayRevenue = (float) (clone $todaySales)->sum('total_amount');
        $todayProfit = (float) (clone $todaySales)->sum('total_profit');
        $todayTransactions = (clone $todaySales)->count();

        $monthStart = now()->startOfMonth()->toDateString();
        $monthRevenue = (float) Sale::whereDate('tbl_sales.sale_date', '>=', $monthStart)->sum('total_amount');
        $monthProfit = (float) Sale::whereDate('tbl_sales.sale_date', '>=', $monthStart)->sum('total_profit');

        $lowStockProducts = Product::active()
            ->lowStock()
            ->orderBy('tbl_products.quantity')
            ->limit(8)
            ->get(['product_id', 'name', 'brand', 'size', 'quantity', 'low_stock_threshold']);

        $recentSales = Sale::with(['user:user_id,name'])
            ->orderByDesc('tbl_sales.sale_date')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_products' => $totalProducts,
                'low_stock_count' => $lowStockCount,
                'inventory_value' => round((float) $inventoryValue, 2),
                'today_revenue' => round($todayRevenue, 2),
                'today_profit' => round($todayProfit, 2),
                'today_transactions' => $todayTransactions,
                'month_revenue' => round($monthRevenue, 2),
                'month_profit' => round($monthProfit, 2),
            ],
            'low_stock_products' => $lowStockProducts,
            'recent_sales' => SaleResource::collection($recentSales)->resolve(),
        ], 200);
    }

    public function salesSummary(Request $request)
    {
        $from = $request->input('from', now()->startOfMonth()->toDateString());
        $to = $request->input('to', now()->toDateString());

        $summary = Sale::whereBetween(DB::raw('DATE(tbl_sales.sale_date)'), [$from, $to])
            ->selectRaw('DATE(tbl_sales.sale_date) as date, COUNT(*) as transactions, SUM(tbl_sales.total_amount) as revenue, SUM(tbl_sales.total_profit) as profit')
            ->groupBy(DB::raw('DATE(tbl_sales.sale_date)'))
            ->orderBy('date')
            ->get();

        $totals = Sale::whereBetween(DB::raw('DATE(tbl_sales.sale_date)'), [$from, $to])
            ->selectRaw('COUNT(*) as transactions, SUM(tbl_sales.total_amount) as revenue, SUM(tbl_sales.total_profit) as profit')
            ->first();

        return response()->json([
            'from' => $from,
            'to' => $to,
            'summary' => $summary,
            'totals' => $totals,
        ], 200);
    }

    public function topProducts(Request $request)
    {
        $from = $request->input('from', now()->startOfMonth()->toDateString());
        $to = $request->input('to', now()->toDateString());
        $limit = min((int) $request->input('limit', 10), 25);

        $topProducts = SaleItem::bestSellers($from, $to, $limit)->get();

        return response()->json([
            'from' => $from,
            'to' => $to,
            'top_products' => $topProducts,
        ], 200);
    }

    public function inventoryReport()
    {
        $products = Product::active()
            ->orderBy('tbl_products.brand')
            ->orderBy('tbl_products.name')
            ->get()
            ->map(function (Product $product) {
                return [
                    'product_id' => $product->product_id,
                    'name' => $product->name,
                    'brand' => $product->brand,
                    'size' => $product->size,
                    'quantity' => $product->quantity,
                    'capital_price' => $product->capital_price,
                    'selling_price' => $product->selling_price,
                    'stock_value' => round((float) $product->capital_price * $product->quantity, 2),
                    'potential_revenue' => round((float) $product->selling_price * $product->quantity, 2),
                    'is_low_stock' => $product->isLowStock(),
                ];
            });

        $totals = [
            'total_units' => $products->sum('quantity'),
            'stock_value' => round($products->sum('stock_value'), 2),
            'potential_revenue' => round($products->sum('potential_revenue'), 2),
            'low_stock_count' => $products->where('is_low_stock', true)->count(),
        ];

        return response()->json([
            'products' => $products,
            'totals' => $totals,
        ], 200);
    }
}
