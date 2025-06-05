<?php

declare(strict_types=1);

use App\Http\Controllers\Api\v1\Auth\AuthController;
use App\Http\Controllers\Api\v1\User\UserController;

Route::prefix('v1')->group(function (): void {
    // Auth Module
    Route::prefix('auth')
        ->name('auth.')
        ->group(function () {
            Route::post('login', [AuthController::class, 'login']);
            Route::post('refresh-token', [AuthController::class, 'refreshToken']);
            Route::middleware(['auth:sanctum'])->group(function () {
                Route::post('logout', [AuthController::class, 'logout']);
                Route::get('user', [AuthController::class, 'user']);
            });
        });

    Route::middleware(['auth:sanctum'])->group(function () {
        // User Module
        Route::prefix('user')
            ->name('user.')
            ->group(function (): void {
                Route::apiResource('users', UserController::class);
            });
    });
});
