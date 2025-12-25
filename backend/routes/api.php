<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')
        ->name('auth.')
        ->group(function () {
            Route::post('/register', [AuthController::class, 'register']);
            Route::post('/login', [AuthController::class, 'login']);
        });

    /** Protected Routes **/
    Route::middleware('auth:api')->group(function () {
        /**
         * Auth Module
         */
        Route::prefix('auth')
            ->name('auth.')
            ->group(function () {
                Route::post('/logout', [AuthController::class, 'logout']);
                Route::post('/refresh', [AuthController::class, 'refresh']);
                Route::post('/change-password', [AuthController::class, 'changePassword']);
            });

        /**
         * User Module
         */
        Route::prefix('users')
            ->name('users.')
            ->group(function () {
                Route::get('/me', [AuthController::class, 'me']);
                Route::get('/user', function (Request $request) {
                    return $request->user();
                });
                Route::apiResource('users', UserController::class);
            });
    });
});
