<?php

use App\Http\Middleware\HandleTenancyFromSession;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    /*
     * User Access Management Module
     * This module handles user management functionalities such as creating, updating, and deleting users.
     */
    Route::name('uam.')
        ->prefix('uam')
        ->middleware([HandleTenancyFromSession::class])
        ->group(function () {
            Route::resource('users', App\Http\Controllers\Uam\User\UserController::class);
            Route::resource('roles', App\Http\Controllers\Uam\Role\RoleController::class);
        });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
