<?php

namespace Database\Seeders;

use App\Enums\Uam\Role\RoleEnum;
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
            'name' => 'Super Admin',
            'email' => 'superadmin@app.com',
            'name' => 'Super Admin Company',
            'short_name' => 'SAC',
            'role' => RoleEnum::SuperAdmin,
        ],
        [
            'name' => 'Company Admin',
            'email' => 'companyadmin@app.com',
            'name' => 'Dummy Company',
            'short_name' => 'Dummy',
            'role' => RoleEnum::CompanyAdmin,
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

            // Create or update company
            $company = Company::updateOrCreate(
                ['short_name' => $admin['short_name']],
                ['name' => $admin['name']]
            );

            // 🔑 Set company context
            app(PermissionRegistrar::class)->setPermissionsTeamId($company->id);

            // Create role in company
            $role = Role::firstOrCreate([
                'name' => $admin['role']->name,
                'guard_name' => 'web',
                'company_id' => $company->id,
            ]);

            // Assign role
            if (!$user->hasRole($role->name)) {
                $user->assignRole($role);
            }

            // Optional: attach company relationship
            if (method_exists($user, 'companies')) {
                $user->companies()->syncWithoutDetaching([$company->id]);
            }
        }
    }
}
