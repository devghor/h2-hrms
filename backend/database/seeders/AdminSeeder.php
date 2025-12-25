<?php

namespace Database\Seeders;

use App\Enums\Role\RoleEnum;
use App\Models\Tenancy\Tenant;
use App\Models\Uam\Role;
use App\Models\Uam\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\PermissionRegistrar;

class AdminSeeder extends Seeder
{
    private array $admins = [
        [
            'name' => 'Super Admin',
            'email' => 'superadmin@app.com',
            'name' => 'Super Admin Tenant',
            'slug' => 'super-admin-tenant',
            'role' => RoleEnum::SuperAdmin,
        ],
        [
            'name' => 'Tenant Admin',
            'email' => 'tenantadmin@app.com',
            'name' => 'Dummy Tenant',
            'slug' => 'dummy-tenant',
            'role' => RoleEnum::TenantAdmin,
        ],
    ];

    public function run(): void
    {
        foreach ($this->admins as $admin) {
            // Create or update tenant
            $tenant = Tenant::create([
                'slug' => $admin['slug'],
                'name' => $admin['name']
            ]);

            // Create or update user
            $user = User::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => Hash::make('password'),
                    'tenant_id' => $tenant->id,
                ]
            );

            // 🔑 Set tenant context
            app(PermissionRegistrar::class)->setPermissionsTeamId($tenant->id);

            // Create role in tenant
            $role = Role::firstOrCreate([
                'name' => $admin['role']->name,
                'guard_name' => 'api',
                'tenant_id' => $tenant->id,
            ]);

            // Assign role
            if (!$user->hasRole($role->name)) {
                $user->assignRole($role);
            }
        }
    }
}
