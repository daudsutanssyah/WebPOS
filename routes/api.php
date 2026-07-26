<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ProductCategoryController;
use App\Http\Controllers\Api\V1\ProductCategoryImageController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/product-categories/options', [ProductCategoryController::class, 'options']);
        Route::post('/product-categories/{id}/image', [ProductCategoryImageController::class, 'store']);
        Route::apiResource('product-categories', ProductCategoryController::class);

        Route::get('/products/options', [\App\Http\Controllers\Api\V1\ProductController::class, 'options']);
        Route::post('/products/{id}/image', [\App\Http\Controllers\Api\V1\ProductImageController::class, 'store']);
        Route::apiResource('products', \App\Http\Controllers\Api\V1\ProductController::class);

        Route::get('/customers/options', [\App\Http\Controllers\Api\V1\CustomerController::class, 'options']);
        Route::apiResource('customers', \App\Http\Controllers\Api\V1\CustomerController::class);
    });
});
