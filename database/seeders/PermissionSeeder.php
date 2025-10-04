<?php

namespace Database\Seeders;

use App\Models\Uam\Permission;
use App\Models\Uam\PermissionGroup;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{

    const KEY_CREATE = 'Create';
    const KEY_READ = 'Read';
    const KEY_UPDATE = 'Update';
    const KEY_DELETE = 'Delete';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $permissions = [
            /**
             * General Module
             */

            // Dashboard
            ['module' => 'General', 'group' => 'General > Dashboard', 'name' => 'ReadGeneralDashboard', 'display_name' => self::KEY_READ],

            /**
             * Uam Module
             */

            // User
            ['module' => 'Uam', 'group' => 'Uam > User', 'name' => 'CreateUamUser', 'display_name' => self::KEY_CREATE],
            ['module' => 'Uam', 'group' => 'Uam > User', 'name' => 'ReadUamUser', 'display_name' => self::KEY_READ],
            ['module' => 'Uam', 'group' => 'Uam > User', 'name' => 'UpdateUamUser', 'display_name' => self::KEY_UPDATE],
            ['module' => 'Uam', 'group' => 'Uam > User', 'name' => 'DeleteUamUser', 'display_name' => self::KEY_DELETE],

            // Role
            ['module' => 'Uam', 'group' => 'Uam > Role', 'name' => 'CreateUamRole', 'display_name' => self::KEY_CREATE],
            ['module' => 'Uam', 'group' => 'Uam > Role', 'name' => 'ReadUamRole', 'display_name' => self::KEY_READ],
            ['module' => 'Uam', 'group' => 'Uam > Role', 'name' => 'UpdateUamRole', 'display_name' => self::KEY_UPDATE],
            ['module' => 'Uam', 'group' => 'Uam > Role', 'name' => 'DeleteUamRole', 'display_name' => self::KEY_DELETE],

            // Permission
            ['module' => 'Uam', 'group' => 'Uam > Permission', 'name' => 'CreateUamPermission', 'display_name' => self::KEY_CREATE],
            ['module' => 'Uam', 'group' => 'Uam > Permission', 'name' => 'ReadUamPermission', 'display_name' => self::KEY_READ],
            ['module' => 'Uam', 'group' => 'Uam > Permission', 'name' => 'UpdateUamPermission', 'display_name' => self::KEY_UPDATE],
            ['module' => 'Uam', 'group' => 'Uam > Permission', 'name' => 'DeleteUamPermission', 'display_name' => self::KEY_DELETE],

            /**
             * Configuration Module
             */

            // Company
            ['module' => 'Configuration', 'group' => 'Configuration > Company', 'name' => 'CreateConfigurationCompany', 'display_name' => self::KEY_CREATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Company', 'name' => 'ReadConfigurationCompany', 'display_name' => self::KEY_READ],
            ['module' => 'Configuration', 'group' => 'Configuration > Company', 'name' => 'UpdateConfigurationCompany', 'display_name' => self::KEY_UPDATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Company', 'name' => 'DeleteConfigurationCompany', 'display_name' => self::KEY_DELETE],

            // Branch
            ['module' => 'Configuration', 'group' => 'Configuration > Branch', 'name' => 'CreateConfigurationBranch', 'display_name' => self::KEY_CREATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Branch', 'name' => 'ReadConfigurationBranch', 'display_name' => self::KEY_READ],
            ['module' => 'Configuration', 'group' => 'Configuration > Branch', 'name' => 'UpdateConfigurationBranch', 'display_name' => self::KEY_UPDATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Branch', 'name' => 'DeleteConfigurationBranch', 'display_name' => self::KEY_DELETE],

            // Division
            ['module' => 'Configuration', 'group' => 'Configuration > Division', 'name' => 'CreateConfigurationDivision', 'display_name' => self::KEY_CREATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Division', 'name' => 'ReadConfigurationDivision', 'display_name' => self::KEY_READ],
            ['module' => 'Configuration', 'group' => 'Configuration > Division', 'name' => 'UpdateConfigurationDivision', 'display_name' => self::KEY_UPDATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Division', 'name' => 'DeleteConfigurationDivision', 'display_name' => self::KEY_DELETE],

            // Department
            ['module' => 'Configuration', 'group' => 'Configuration > Department', 'name' => 'CreateConfigurationDepartment', 'display_name' => self::KEY_CREATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Department', 'name' => 'ReadConfigurationDepartment', 'display_name' => self::KEY_READ],
            ['module' => 'Configuration', 'group' => 'Configuration > Department', 'name' => 'UpdateConfigurationDepartment', 'display_name' => self::KEY_UPDATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Department', 'name' => 'DeleteConfigurationDepartment', 'display_name' => self::KEY_DELETE],

            // Designation
            ['module' => 'Configuration', 'group' => 'Configuration > Designation', 'name' => 'CreateConfigurationDesignation', 'display_name' => self::KEY_CREATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Designation', 'name' => 'ReadConfigurationDesignation', 'display_name' => self::KEY_READ],
            ['module' => 'Configuration', 'group' => 'Configuration > Designation', 'name' => 'UpdateConfigurationDesignation', 'display_name' => self::KEY_UPDATE],
            ['module' => 'Configuration', 'group' => 'Configuration > Designation', 'name' => 'DeleteConfigurationDesignation', 'display_name' => self::KEY_DELETE],
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
