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
            foreach ($submodules as $submodule => $actions) {
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

                foreach ($actions as $action) {
                    $permissionName = "{$module}.{$submodule}.{$action}";
                    $allPermissionNames[] = $permissionName;
                    Permission::updateOrCreate(
                        ['name' => $permissionName],
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
        return [
            'uam' => [
                'user' => ['menu', 'create', 'read', 'edit', 'delete'],
                'role' => ['menu', 'create', 'read', 'edit', 'delete'],
                'permission' => ['menu', 'create', 'read', 'edit', 'delete'],
            ],
        ];
    }
}
