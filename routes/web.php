<?php

use App\Http\Controllers\Configuration\Company\CompanyController;
use App\Http\Controllers\Configuration\Department\DepartmentController;
use App\Http\Controllers\Configuration\Desk\DeskController;
use App\Http\Controllers\Configuration\Division\DivisionController;
use App\Http\Controllers\Uam\Permission\PermissionController;
use App\Http\Controllers\Uam\Role\RoleController;
use App\Http\Controllers\Uam\User\UserController;
use App\Http\Middleware\HandleTenancyFromSession;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', HandleTenancyFromSession::class])->group(function (): void {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    /*
     * User Access Management Module
     * This module handles user management functionalities such as creating, updating, and deleting users.
     */
    Route::name('uam.')
        ->prefix('uam')
        ->group(function (): void {
            Route::resource('users', UserController::class);
            Route::resource('roles', RoleController::class);
            Route::resource('permissions', PermissionController::class);
        });

    /**
     * Configuration Module
     * This module handles application configuration settings such as tenant management.
     */
    Route::name('configuration.')
        ->prefix('configuration')
        ->group(function (): void {
            Route::resource('desks', DeskController::class);
            Route::get('companies/{company}/switch', [CompanyController::class, 'switchCompany'])->name('companies.switch');
            Route::resource('companies', CompanyController::class);
            Route::resource('divisions', DivisionController::class);
            Route::resource('departments', DepartmentController::class);
        });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
