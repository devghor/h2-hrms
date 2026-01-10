<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Base\DesignationController;
use App\Http\Controllers\Api\V1\Uam\UserController;
use App\Http\Controllers\Api\V1\Uam\RoleController;
use App\Http\Controllers\Api\V1\Uam\PermissionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByRequestData;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')
        ->name('auth.')
        ->group(function () {
            Route::post('/register', [AuthController::class, 'register']);
            Route::post('/login', [AuthController::class, 'login']);
        });

    /** Protected Routes **/
    Route::middleware(['auth:sanctum', 'validate.token.expiration', InitializeTenancyByRequestData::class])->group(function () {
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
        Route::prefix('uam')
            ->name('uam.')
            ->group(function () {
                Route::get('/me', [AuthController::class, 'me']);
                Route::get('/user', function (Request $request) {
                    return $request->user();
                });

                // User resource routes with specific permissions
                Route::post('users/bulk-delete', [UserController::class, 'bulkDestroy'])
                    ->name('users.bulk-destroy');
                Route::apiResource('users', UserController::class);

                // Role management
                Route::post('roles/bulk-delete', [RoleController::class, 'bulkDestroy'])
                    ->name('roles.bulk-destroy');
                Route::apiResource('roles', RoleController::class);
                Route::post('roles/{role}/permissions', [RoleController::class, 'assignPermissions'])
                    ->name('roles.assign-permissions');

                // Permission management
                Route::get('permissions', [PermissionController::class, 'index'])
                    ->name('permissions.index');
                Route::get('permissions/grouped', [PermissionController::class, 'grouped'])
                    ->name('permissions.grouped');
                Route::get('permissions/user', [PermissionController::class, 'userPermissions'])
                    ->name('permissions.user');

                // Alternative: Apply middleware per route
                // Route::get('/users', [UserController::class, 'index'])->middleware('permission:READ_UAM_USER');
                // Route::post('/users', [UserController::class, 'store'])->middleware('permission:CREATE_UAM_USER');
                // Route::get('/users/{user}', [UserController::class, 'show'])->middleware('permission:READ_UAM_USER');
                // Route::put('/users/{user}', [UserController::class, 'update'])->middleware('permission:UPDATE_UAM_USER');
                // Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware('permission:DELETE_UAM_USER');
            });

        /**
         * Base Module
         */
        Route::prefix('base')
            ->name('base.')
            ->group(function () {
                // Designation management
                Route::get('designations/all', [DesignationController::class, 'all'])
                    ->name('designations.all');
                Route::post('designations/{ulid}/restore', [DesignationController::class, 'restore'])
                    ->name('designations.restore');
                Route::apiResource('designations', DesignationController::class);
            });
    });
});
