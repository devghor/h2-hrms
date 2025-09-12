<?php

use App\Http\Middleware\HandleTenancyFromSession;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', HandleTenancyFromSession::class])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    /*
     * User Access Management Module
     * This module handles user management functionalities such as creating, updating, and deleting users.
     */
    Route::name('uam.')
        ->prefix('uam')
        ->group(function () {
            Route::resource('users', App\Http\Controllers\Uam\User\UserController::class);
            Route::resource('roles', App\Http\Controllers\Uam\Role\RoleController::class);
            Route::resource('permissions', App\Http\Controllers\Uam\Permission\PermissionController::class);
        });

    /**
     * Configuration Module
     * This module handles application configuration settings such as tenant management.
     */
    Route::name('configuration.')
        ->prefix('configuration')
        ->group(function () {
            Route::resource('companies', App\Http\Controllers\Configuration\Company\CompanyController::class);
            Route::resource('divisions', App\Http\Controllers\Configuration\Division\DivisionController::class);
        });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
