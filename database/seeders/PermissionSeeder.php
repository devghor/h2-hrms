<?php

namespace Database\Seeders;

use App\Enums\Uam\PermissionEnum;
use App\Models\Uam\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{

    const LABEL_CREATE = 'Create';
    const LABEL_READ = 'Read';
    const LABEL_UPDATE = 'Update';
    const LABEL_DELETE = 'Delete';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $permissions = [
            // Dashboard
            ['module' => 'General', 'group' => 'General > Dashboard', 'name' => PermissionEnum::ReadGeneralDashboard->value, 'display_name' => self::LABEL_READ],

            /**
             * Uam Module
             */

            // User
            ['module' => 'Uam', 'group' => 'Uam > User', 'name' => PermissionEnum::CreateUamUser->value, 'display_name' => self::LABEL_CREATE],
            ['module' => 'Uam', 'group' => 'Uam > User', 'name' => PermissionEnum::ReadUamUser->value, 'display_name' => self::LABEL_READ],
            ['module' => 'Uam', 'group' => 'Uam > User', 'name' => PermissionEnum::UpdateUamUser->value, 'display_name' => self::LABEL_UPDATE],
            ['module' => 'Uam', 'group' => 'Uam > User', 'name' => PermissionEnum::DeleteUamUser->value, 'display_name' => self::LABEL_DELETE],

            // Role
            ['module' => 'Uam', 'group' => 'Uam > Role', 'name' => PermissionEnum::CreateUamRole->value, 'display_name' => self::LABEL_CREATE],
            ['module' => 'Uam', 'group' => 'Uam > Role', 'name' => PermissionEnum::ReadUamRole->value, 'display_name' => self::LABEL_READ],
            ['module' => 'Uam', 'group' => 'Uam > Role', 'name' => PermissionEnum::UpdateUamRole->value, 'display_name' => self::LABEL_UPDATE],
            ['module' => 'Uam', 'group' => 'Uam > Role', 'name' => PermissionEnum::DeleteUamRole->value, 'display_name' => self::LABEL_DELETE],

            // Permission
            ['module' => 'Uam', 'group' => 'Uam > Permission', 'name' => PermissionEnum::CreateUamPermission->value, 'display_name' => self::LABEL_CREATE],
            ['module' => 'Uam', 'group' => 'Uam > Permission', 'name' => PermissionEnum::ReadUamPermission->value, 'display_name' => self::LABEL_READ],
            ['module' => 'Uam', 'group' => 'Uam > Permission', 'name' => PermissionEnum::UpdateUamPermission->value, 'display_name' => self::LABEL_UPDATE],
            ['module' => 'Uam', 'group' => 'Uam > Permission', 'name' => PermissionEnum::DeleteUamPermission->value, 'display_name' => self::LABEL_DELETE],

            /**
             * Employee Moduel
             */

            // Employee
            ['module' => 'Employee', 'group' => 'Employee > Employees', 'name' => PermissionEnum::CreateEmployeeEmployee->value, 'display_name' => self::LABEL_CREATE],
            ['module' => 'Employee', 'group' => 'Employee > Employees', 'name' => PermissionEnum::ReadEmployeeEmployee->value, 'display_name' => self::LABEL_READ],
            ['module' => 'Employee', 'group' => 'Employee > Employees', 'name' => PermissionEnum::UpdateEmployeeEmployee->value, 'display_name' => self::LABEL_UPDATE],
            ['module' => 'Employee', 'group' => 'Employee > Employees', 'name' => PermissionEnum::DeleteEmployeeEmployee->value, 'display_name' => self::LABEL_DELETE],

            /**
             * Payroll Module
             */

            // Salary Head
            ['module' => 'Payroll', 'group' => 'Payroll > Salary Head', 'name' => PermissionEnum::CreatePayrollSalaryHead->value, 'display_name' => self::LABEL_CREATE],
            ['module' => 'Payroll', 'group' => 'Payroll > Salary Head', 'name' => PermissionEnum::ReadPayrollSalaryHead->value, 'display_name' => self::LABEL_READ],
            ['module' => 'Payroll', 'group' => 'Payroll > Salary Head', 'name' => PermissionEnum::UpdatePayrollSalaryHead->value, 'display_name' => self::LABEL_UPDATE],
            ['module' => 'Payroll', 'group' => 'Payroll > Salary Head', 'name' => PermissionEnum::DeletePayrollSalaryHead->value, 'display_name' => self::LABEL_DELETE],

            // Salary Structure
            ['module' => 'Payroll', 'group' => 'Payroll > Salary Structure', 'name' => PermissionEnum::CreatePayrollSalaryStructure->value, 'display_name' => self::LABEL_CREATE],
            ['module' => 'Payroll', 'group' => 'Payroll > Salary Structure', 'name' => PermissionEnum::ReadPayrollSalaryStructure->value, 'display_name' => self::LABEL_READ],
            ['module' => 'Payroll', 'group' => 'Payroll > Salary Structure', 'name' => PermissionEnum::UpdatePayrollSalaryStructure->value, 'display_name' => self::LABEL_UPDATE],
            ['module' => 'Payroll', 'group' => 'Payroll > Salary Structure', 'name' => PermissionEnum::DeletePayrollSalaryStructure->value, 'display_name' => self::LABEL_DELETE],

            /**
             * Configuration Module
             */

            // Company
            ['module' => 'Configuration', 'group' => 'Configuration > Company', 'name' => PermissionEnum::CreateConfigurationCompany->value, 'display_name' => self::LABEL_CREATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Company', 'name' => PermissionEnum::ReadConfigurationCompany->value, 'display_name' => self::LABEL_READ],
            ['module' => 'Configuration', 'group' => 'Configuration > Company', 'name' => PermissionEnum::UpdateConfigurationCompany->value, 'display_name' => self::LABEL_UPDATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Company', 'name' => PermissionEnum::DeleteConfigurationCompany->value, 'display_name' => self::LABEL_DELETE],

            // Branch
            ['module' => 'Configuration', 'group' => 'Configuration > Branch', 'name' => PermissionEnum::CreateConfigurationBranch->value, 'display_name' => self::LABEL_CREATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Branch', 'name' => PermissionEnum::ReadConfigurationBranch->value, 'display_name' => self::LABEL_READ],
            ['module' => 'Configuration', 'group' => 'Configuration > Branch', 'name' => PermissionEnum::UpdateConfigurationBranch->value, 'display_name' => self::LABEL_UPDATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Branch', 'name' => PermissionEnum::DeleteConfigurationBranch->value, 'display_name' => self::LABEL_DELETE],

            // Division
            ['module' => 'Configuration', 'group' => 'Configuration > Division', 'name' => PermissionEnum::CreateConfigurationDivision->value, 'display_name' => self::LABEL_CREATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Division', 'name' => PermissionEnum::ReadConfigurationDivision->value, 'display_name' => self::LABEL_READ],
            ['module' => 'Configuration', 'group' => 'Configuration > Division', 'name' => PermissionEnum::UpdateConfigurationDivision->value, 'display_name' => self::LABEL_UPDATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Division', 'name' => PermissionEnum::DeleteConfigurationDivision->value, 'display_name' => self::LABEL_DELETE],

            // Department
            ['module' => 'Configuration', 'group' => 'Configuration > Department', 'name' => PermissionEnum::CreateConfigurationDepartment->value, 'display_name' => self::LABEL_CREATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Department', 'name' => PermissionEnum::ReadConfigurationDepartment->value, 'display_name' => self::LABEL_READ],
            ['module' => 'Configuration', 'group' => 'Configuration > Department', 'name' => PermissionEnum::UpdateConfigurationDepartment->value, 'display_name' => self::LABEL_UPDATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Department', 'name' => PermissionEnum::DeleteConfigurationDepartment->value, 'display_name' => self::LABEL_DELETE],

            // Designation
            ['module' => 'Configuration', 'group' => 'Configuration > Designation', 'name' => PermissionEnum::CreateConfigurationDesignation->value, 'display_name' => self::LABEL_CREATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Designation', 'name' => PermissionEnum::ReadConfigurationDesignation->value, 'display_name' => self::LABEL_READ],
            ['module' => 'Configuration', 'group' => 'Configuration > Designation', 'name' => PermissionEnum::UpdateConfigurationDesignation->value, 'display_name' => self::LABEL_UPDATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Designation', 'name' => PermissionEnum::DeleteConfigurationDesignation->value, 'display_name' => self::LABEL_DELETE],


        ];


        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission['name']],
                [
                    'guard_name' => 'web',
                    'module' => $permission['module'],
                    'group' => $permission['group'],
                    'display_name' => $permission['display_name'],
                ]
            );
        }

        // Delete permissions not in code
        Permission::whereNotIn('name', array_column($permissions, 'name'))->delete();
    }
}
