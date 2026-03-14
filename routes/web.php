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
            Route::delete('users/bulk-delete', [UserController::class, 'bulkDelete'])->name('users.bulk-delete');
            Route::resource('users', UserController::class);
            Route::delete('roles/bulk-delete', [RoleController::class, 'bulkDelete'])->name('roles.bulk-delete');
            Route::resource('roles', RoleController::class);
            Route::delete('permissions/bulk-delete', [PermissionController::class, 'bulkDelete'])->name('permissions.bulk-delete');
            Route::resource('permissions', PermissionController::class);
        });

    /**
     * Configuration Module
     * This module handles application configuration settings such as tenant management.
     */
    Route::name('configuration.')
        ->prefix('configuration')
        ->group(function (): void {
            Route::delete('desks/bulk-delete', [DeskController::class, 'bulkDelete'])->name('desks.bulk-delete');
            Route::resource('desks', DeskController::class);
            Route::get('companies/{company}/switch', [CompanyController::class, 'switchCompany'])->name('companies.switch');
            Route::delete('companies/bulk-delete', [CompanyController::class, 'bulkDelete'])->name('companies.bulk-delete');
            Route::resource('companies', CompanyController::class);
            Route::delete('divisions/bulk-delete', [DivisionController::class, 'bulkDelete'])->name('divisions.bulk-delete');
            Route::resource('divisions', DivisionController::class);
            Route::delete('departments/bulk-delete', [DepartmentController::class, 'bulkDelete'])->name('departments.bulk-delete');
            Route::resource('departments', DepartmentController::class);
        });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
