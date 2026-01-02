<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class DesignationPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Designation Permissions
            [
                'name' => 'READ_BASE_DESIGNATION',
                'guard_name' => 'api',
                'description' => 'Permission to view designations',
            ],
            [
                'name' => 'CREATE_BASE_DESIGNATION',
                'guard_name' => 'api',
                'description' => 'Permission to create designations',
            ],
            [
                'name' => 'UPDATE_BASE_DESIGNATION',
                'guard_name' => 'api',
                'description' => 'Permission to update designations',
            ],
            [
                'name' => 'DELETE_BASE_DESIGNATION',
                'guard_name' => 'api',
                'description' => 'Permission to delete designations',
            ],
            [
                'name' => 'RESTORE_BASE_DESIGNATION',
                'guard_name' => 'api',
                'description' => 'Permission to restore deleted designations',
            ],
            [
                'name' => 'FORCE_DELETE_BASE_DESIGNATION',
                'guard_name' => 'api',
                'description' => 'Permission to permanently delete designations',
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name'], 'guard_name' => $permission['guard_name']],
                ['description' => $permission['description']]
            );
        }

        $this->command->info('Designation permissions seeded successfully!');
    }
}
