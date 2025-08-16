<?php

namespace Database\Seeders;

use App\Enums\Uam\RoleEnum;
use App\Models\Tenancy\Tenant;
use App\Models\Uam\Role;
use App\Models\Uam\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->createSuperAdmins();
        $this->createTenantAdmins();
    }

    /**
     * Create multiple system-wide Super Admins.
     */
    protected function createSuperAdmins(): void
    {

        $superRole = Role::firstOrCreate(['name' => RoleEnum::SuperAdmin->value, 'guard_name' => 'web', 'tenant_id' => null]);
        $superAdmins = [
            ['name' => 'Super Admin', 'email' => 'superadmin@app.com'],
        ];

        foreach ($superAdmins as $admin) {
            $user = User::firstOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => Hash::make('aaa'),
                ]
            );

            if (!$user->hasRole('super-admin')) {
                $user->assignRole($superRole);
            }

            $this->command->info("✅ Super Admin: {$admin['email']}");
        }
    }

    /**
     * Create Tenant Admins.
     */
    protected function createTenantAdmins(): void
    {
        $tenantAdmins = [
            [
                'name' => 'Dummy Tenant',
                'email' => 'tenantadmin@app.com',
                'company_name' => 'Dummy',
                'company_short_name' => 'Dummy'
            ],
        ];

        foreach ($tenantAdmins as $admin) {
            $user = User::firstOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => Hash::make('aaa'),
                ]
            );

            $tenant = Tenant::create(
                [
                    'company_name' => $admin['company_name'],
                    'company_short_name' => $admin['company_short_name'],
                ]
            );

            $user->tenants()->sync([$tenant->id]);

            $tenantRole = Role::firstOrCreate([
                'name' => RoleEnum::TenantAdmin->value,
                'guard_name' => 'web',
                'tenant_id' => $tenant->id
            ]);

            if (!$user->hasRole(RoleEnum::TenantAdmin->value)) {
                $user->assignRole($tenantRole);
            }

            $this->command->info("✅ Tenant Admin: {$admin['email']}");
        }
    }
}
