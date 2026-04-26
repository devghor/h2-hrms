<?php

use App\Http\Controllers\Configuration\Branch\BranchController;
use App\Http\Controllers\Configuration\Company\CompanyController;
use App\Http\Controllers\Configuration\Department\DepartmentController;
use App\Http\Controllers\Configuration\Desk\DeskController;
use App\Http\Controllers\Configuration\Unit\UnitController;
use App\Http\Controllers\Configuration\Designation\DesignationController;
use App\Http\Controllers\Configuration\Division\DivisionController;
use App\Http\Controllers\Employee\Employee\EmployeeController;
use App\Http\Controllers\Employee\EmployeeContact\EmployeeContactController;
use App\Http\Controllers\Employee\EmployeeDocument\EmployeeDocumentController;
use App\Http\Controllers\Employee\EmployeeEducation\EmployeeEducationController;
use App\Http\Controllers\Employee\EmployeeExperience\EmployeeExperienceController;
use App\Http\Controllers\Notification\NotificationController;
use App\Http\Controllers\Payroll\PayrollEmployeeSalaryProfileController;
use App\Http\Controllers\Payroll\PayrollSalaryHeadController;
use App\Http\Controllers\Payroll\PayrollSalaryStructureController;
use App\Http\Controllers\Uam\Permission\PermissionController;
use App\Http\Controllers\Uam\Role\RoleController;
use App\Http\Controllers\Uam\User\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    /**
     * Notification Module
     */
    Route::name('notification.')
        ->prefix('notification')
        ->group(function (): void {
            Route::get('/', [NotificationController::class, 'index'])->name('index');
            Route::get('dropdown', [NotificationController::class, 'dropdown'])->name('dropdown');
            Route::get('{id}', [NotificationController::class, 'show'])->name('show');
            Route::patch('{id}/read', [NotificationController::class, 'markAsRead'])->name('read');
            Route::post('mark-all-read', [NotificationController::class, 'markAllRead'])->name('mark-all-read');
            Route::delete('{id}', [NotificationController::class, 'destroy'])->name('destroy');
        });


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
            Route::delete('branches/bulk-delete', [BranchController::class, 'bulkDelete'])->name('branches.bulk-delete');
            Route::resource('branches', BranchController::class);
            Route::delete('desks/bulk-delete', [DeskController::class, 'bulkDelete'])->name('desks.bulk-delete');
            Route::resource('desks', DeskController::class);
            Route::get('companies/{company}/switch', [CompanyController::class, 'switchCompany'])->name('companies.switch');
            Route::delete('companies/bulk-delete', [CompanyController::class, 'bulkDelete'])->name('companies.bulk-delete');
            Route::resource('companies', CompanyController::class);
            Route::delete('divisions/bulk-delete', [DivisionController::class, 'bulkDelete'])->name('divisions.bulk-delete');
            Route::resource('divisions', DivisionController::class);
            Route::delete('designations/bulk-delete', [DesignationController::class, 'bulkDelete'])->name('designations.bulk-delete');
            Route::resource('designations', DesignationController::class);
            Route::delete('departments/bulk-delete', [DepartmentController::class, 'bulkDelete'])->name('departments.bulk-delete');
            Route::resource('departments', DepartmentController::class);
            Route::delete('units/bulk-delete', [UnitController::class, 'bulkDelete'])->name('units.bulk-delete');
            Route::resource('units', UnitController::class);
        });

    /**
     * Employee Module
     * This module handles employee management and related HR sub-entities.
     */
    Route::name('employee.')
        ->prefix('employee')
        ->group(function (): void {
            // Employees
            Route::delete('employees/bulk-delete', [EmployeeController::class, 'bulkDelete'])->name('employees.bulk-delete');
            Route::resource('employees', EmployeeController::class);

            // Employee Contacts
            Route::post('employee-contacts', [EmployeeContactController::class, 'store'])->name('employee-contacts.store');
            Route::put('employee-contacts/{contact}', [EmployeeContactController::class, 'update'])->name('employee-contacts.update');
            Route::delete('employee-contacts/{contact}', [EmployeeContactController::class, 'destroy'])->name('employee-contacts.destroy');

            // Employee Documents
            Route::post('employee-documents', [EmployeeDocumentController::class, 'store'])->name('employee-documents.store');
            Route::put('employee-documents/{document}', [EmployeeDocumentController::class, 'update'])->name('employee-documents.update');
            Route::delete('employee-documents/{document}', [EmployeeDocumentController::class, 'destroy'])->name('employee-documents.destroy');

            // Employee Education
            Route::post('employee-education', [EmployeeEducationController::class, 'store'])->name('employee-education.store');
            Route::put('employee-education/{education}', [EmployeeEducationController::class, 'update'])->name('employee-education.update');
            Route::delete('employee-education/{education}', [EmployeeEducationController::class, 'destroy'])->name('employee-education.destroy');

            // Employee Experience
            Route::post('employee-experience', [EmployeeExperienceController::class, 'store'])->name('employee-experience.store');
            Route::put('employee-experience/{experience}', [EmployeeExperienceController::class, 'update'])->name('employee-experience.update');
            Route::delete('employee-experience/{experience}', [EmployeeExperienceController::class, 'destroy'])->name('employee-experience.destroy');
        });

    /**
     * Payroll Module
     */
    Route::name('payroll.')
        ->prefix('payroll')
        ->group(function (): void {
            Route::delete('salary-heads/bulk-delete', [PayrollSalaryHeadController::class, 'bulkDelete'])
                ->name('salary-heads.bulk-delete');
            Route::resource('salary-heads', PayrollSalaryHeadController::class)
                ->except(['create', 'edit']);
            Route::delete('salary-structures/bulk-delete', [PayrollSalaryStructureController::class, 'bulkDelete'])
                ->name('salary-structures.bulk-delete');
            Route::resource('salary-structures', PayrollSalaryStructureController::class)
                ->except(['create', 'edit']);

            Route::get('employee-salary-profiles', [PayrollEmployeeSalaryProfileController::class, 'index'])
                ->name('employee-salary-profiles.index');
            Route::get('employee-salary-profiles/{userId}', [PayrollEmployeeSalaryProfileController::class, 'show'])
                ->name('employee-salary-profiles.show');
            Route::post('employee-salary-profiles', [PayrollEmployeeSalaryProfileController::class, 'store'])
                ->name('employee-salary-profiles.store');
        });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
