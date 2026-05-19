<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public routes (no authentication required)
|--------------------------------------------------------------------------
*/
Route::controller(AuthController::class)->prefix('/auth')->group(function () {
    Route::post('/login', 'login');
});

/*
|--------------------------------------------------------------------------
| Protected routes (Sanctum authentication required)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::controller(AuthController::class)->prefix('/auth')->group(function () {
        Route::get('/me', 'me');
        Route::post('/logout', 'logout');
    });

    Route::controller(ReportController::class)->prefix('/reports')->group(function () {
        Route::get('/dashboard', 'dashboard');
        Route::get('/salesSummary', 'salesSummary');
        Route::get('/topProducts', 'topProducts');
        Route::get('/inventory', 'inventoryReport');
    });

    Route::controller(ProductController::class)->prefix('/product')->group(function () {
        Route::get('/loadProducts', 'loadProducts');
        Route::get('/loadAllProducts', 'loadAllProducts');
        Route::get('/getProductImage/{product}', 'getProductImage');
        Route::post('/storeProduct', 'storeProduct');
        Route::post('/updateProduct/{product}', 'updateProduct');
        Route::put('/destroyProduct/{product}', 'destroyProduct');
    });

    Route::controller(SaleController::class)->prefix('/sale')->group(function () {
        Route::get('/loadSales', 'loadSales');
        Route::post('/storeSale', 'storeSale');
    });

    Route::controller(UserController::class)->prefix('/user')->group(function () {
        Route::get('/loadUsers', 'loadUsers');
        Route::post('/storeUser', 'storeUser');
        Route::put('/updateUser/{user}', 'updateUser');
        Route::put('/destroyUser/{user}', 'destroyUser');
    });
});
