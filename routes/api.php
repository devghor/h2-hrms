<?php

declare(strict_types=1);

use App\Http\Controllers\Api\v1\Auth\AuthController;
use App\Http\Controllers\Api\v1\Uam\RoleController;
use App\Http\Controllers\Api\v1\Uam\UserController;
use Illuminate\Support\Facades\Route;

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
        // UAM Module
        Route::prefix('uam')
            ->name('uam.')
            ->group(function (): void {
                Route::apiResource('users', UserController::class);
                Route::apiResource('roles', RoleController::class);
            });
    });
});
