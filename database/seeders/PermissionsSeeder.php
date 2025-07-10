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
                'user' => ['uamUser.menu', 'uamUser.create', 'uamUser.read', 'uamUser.edit', 'uamUser.delete'],
                'role' => ['uamRole.menu', 'uamRole.create', 'uamRole.read', 'uamRole.edit', 'uamRole.delete'],
                'permission' => ['uamPermission.menu', 'uamPermission.create', 'uamPermission.read', 'uamPermission.edit', 'uamPermission.delete'],
            ],
        ];
    }
}
