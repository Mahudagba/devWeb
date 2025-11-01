<?php

use App\Http\Controllers\Api\AdminStatsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

});

// Public read-only routes
Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{category}', [CategoryController::class, 'show']);

Route::get('products', [ProductController::class, 'index']);
Route::get('products/{product}', [ProductController::class, 'show']);

Route::group(['prefix' => 'auth', 'middleware' => ['auth:sanctum']], function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/update/profile', [AuthController::class, 'updateProfile']);
    Route::delete('/logout', [AuthController::class, 'logout']);

});

Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::post('/checkout', [CheckoutController::class, 'createOrder']);
    Route::delete('/user/delete', [AuthController::class, 'deleteAccount']);

    Route::post('/orders/{id}/cancel', [CheckoutController::class, 'cancel']);

    // Orders (for authenticated users)
    Route::apiResource('orders', OrderController::class)->except(['store', 'update']);

});

Route::group(['prefix' => 'admin', 'middleware' => ['auth:sanctum']], function () {

    // Categories - only admin can create/update/delete
    Route::middleware('can:manage-categories')->group(function () {
        Route::post('categories', [CategoryController::class, 'store']);
        Route::put('categories/{category}', [CategoryController::class, 'update']);
        Route::delete('categories/{category}', [CategoryController::class, 'destroy']);
    });

    Route::middleware('can:manage-stats')->group(function () {
        Route::get('stats', [AdminStatsController::class, 'index']);
    });

    Route::middleware('can:manage-users')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        
    });

    // Products - only admin can create/update/delete
    Route::middleware('can:manage-products')->group(function () {
        Route::post('products', [ProductController::class, 'store']);
        Route::put('products/{product}', [ProductController::class, 'update']);
        Route::delete('products/{product}', [ProductController::class, 'destroy']);
    });
    Route::middleware('can:manage-orders')->group(function () {
        Route::get('orders', [CheckoutController::class, 'index']);      // admin
        Route::get('orders/{id}', [CheckoutController::class, 'show']);  // admin 
        Route::put('orders/{id}/status', [CheckoutController::class, 'updateStatus']); // admin
        Route::post('orders/create', [OrderController::class, 'storeByAdmin']); // admin
        Route::delete('/orders/{id}', [OrderController::class, 'destroyByAdmin']); // admin
        // Route::get('users', [AuthController::class, 'index']); // admin
    });
});

// Webhook Stripe (pas besoin d'auth)
Route::post('/stripe/webhook', [CheckoutController::class, 'stripeWebhook']);
