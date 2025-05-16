<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Modules\User\Http\Controllers\UserController;

Route::prefix('v1/user')->group(function () {
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::apiResource('users', UserController::class);
    });
});
