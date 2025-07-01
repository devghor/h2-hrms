<?php

namespace Database\Seeders;

use App\Models\Uam\Permission;
use App\Models\Uam\PermissionGroup;
use Illuminate\Database\Seeder;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $allPermissionNames = [];

        $structuredPermissions = $this->getStructuredPermissions();

        foreach ($structuredPermissions as $module => $submodules) {
            $submoduleOrder = 1;
            foreach ($submodules as $submodule => $keys) {
                $group = PermissionGroup::updateOrCreate(
                    [
                        'module' => $module,
                        'submodule' => $submodule,
                    ],
                    [
                        'order' => $submoduleOrder,
                    ]
                );

                $submoduleOrder++;

                foreach ($keys as $key) {
                    $allPermissionNames[] = $key;
                    Permission::updateOrCreate(
                        ['name' => $key],
                        [
                            'permission_group_id' => $group->id,
                        ]
                    );
                }
            }
        }

        // Delete permissions not in code
        Permission::whereNotIn('name', $allPermissionNames)->delete();

        // Clean up orphaned permission groups
        PermissionGroup::doesntHave('permissions')->delete();
    }

    private function getStructuredPermissions(): array
    {
        // [
        //    'module' => 'submodule' => ['permission_key', 'permission_key', 'permission_key', 'permission_key']
        // ]
        // permission_key = 'module.submodule.action'
        // all key parts are single word, dot is used as separator
        return [
            'uam' => [
                'user' => ['uam.user.menu', 'uam.user.create', 'uam.user.read', 'uam.user.edit', 'uam.user.delete'],
                'role' => ['uam.role.menu', 'uam.role.create', 'uam.role.read', 'uam.role.edit', 'uam.role.delete'],
                'permission' => ['uam.permission.menu', 'uam.permission.create', 'uam.permission.read', 'uam.permission.edit', 'uam.permission.delete'],
            ],
        ];
    }
}
