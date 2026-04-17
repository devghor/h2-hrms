<?php

namespace Database\Seeders;

use App\Enums\Uam\PermissionEnum;
use App\Models\Configuration\Company\Company;
use App\Models\Uam\Role;
use App\Models\Uam\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\PermissionRegistrar;

class AdminSeeder extends Seeder
{
    private array $admins = [
        [
            'user_name' => 'Super Admin',
            'email' => 'superadmin@app.com',
            'company_name' => 'Super Admin Company',
            'short_name' => 'sac',
            'permission' => PermissionEnum::SuperAdmin,
        ],
        [
            'user_name' => 'Company Admin',
            'email' => 'companyadmin@app.com',
            'company_name' => 'Dummy Company',
            'short_name' => 'dummy',
            'permission' => PermissionEnum::CompanyAdmin,
        ],
    ];

    public function run(): void
    {
        foreach ($this->admins as $admin) {
            $user = User::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['user_name'],
                    'password' => Hash::make('password'),
                ]
            );

            $company = Company::updateOrCreate(
                ['name' => $admin['company_name']],
                ['short_name' => $admin['short_name']],
            );

            $user->companies()->syncWithoutDetaching([$company->id]);

            // Set company context
            app(PermissionRegistrar::class)->setPermissionsTeamId($company->id);

            $role = null;

            if (PermissionEnum::SuperAdmin === $admin['permission']) {
                $role = Role::firstOrCreate([
                    'name' => 'Super Admin',
                    'guard_name' => 'web',
                    'company_id' => $company->id,
                ]);

                $role->syncPermissions([PermissionEnum::SuperAdmin->value]);
            }

            if (PermissionEnum::CompanyAdmin === $admin['permission']) {
                $role = Role::firstOrCreate([
                    'name' => 'Company Admin',
                    'guard_name' => 'web',
                    'company_id' => $company->id,
                ]);

                $role->syncPermissions([PermissionEnum::CompanyAdmin->value]);
            }

            if ($role) {
                if (!$user->hasRole($role->name)) {
                    $user->assignRole($role);
                }
            }
        }
    }
}
