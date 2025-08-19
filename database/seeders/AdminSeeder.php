<?php

namespace Database\Seeders;

use App\Enums\Uam\RoleEnum;
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
            'company_name' => 'Super Admin Tenant',
            'company_short_name' => 'SAT',
            'role' => RoleEnum::SuperAdmin,
        ],
        [
            'name' => 'Tenant Admin',
            'email' => 'tenantadmin@app.com',
            'company_name' => 'Dummy',
            'company_short_name' => 'Dummy',
            'role' => RoleEnum::TenantAdmin,
        ],
    ];

    public function run(): void
    {
        foreach ($this->admins as $admin) {
            // Create or update user
            $user = User::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => Hash::make('password'),
                ]
            );

            // Create or update tenant
            $tenant = Tenant::updateOrCreate(
                ['company_short_name' => $admin['company_short_name']],
                ['company_name' => $admin['company_name']]
            );

            // 🔑 Set tenant context
            app(PermissionRegistrar::class)->setPermissionsTeamId($tenant->id);

            // Create role in tenant
            $role = Role::firstOrCreate([
                'name' => $admin['role']->name,
                'guard_name' => 'web',
                'tenant_id' => $tenant->id,
            ]);

            // Assign role
            if (!$user->hasRole($role->name)) {
                $user->assignRole($role);
            }

            // Optional: attach tenant relationship
            if (method_exists($user, 'tenants')) {
                $user->tenants()->syncWithoutDetaching([$tenant->id]);
            }
        }
    }
}
