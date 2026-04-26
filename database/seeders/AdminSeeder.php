<?php

namespace Database\Seeders;

use App\Enums\Uam\GlobalRoleEnum;
use App\Enums\Uam\PermissionEnum;
use App\Models\Configuration\Company\Company;
use App\Models\Uam\Role;
use App\Models\Uam\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    private array $users = [
        [
            'user_name' => 'Super Admin',
            'email' => 'superadmin@app.com',
            'company_name' => 'Super Admin Company',
            'short_name' => 'sac',
            'global_role' => GlobalRoleEnum::SuperAdmin,
            'role_name' => '',
        ],
        [
            'user_name' => 'Company Admin',
            'email' => 'companyadmin@app.com',
            'company_name' => 'Dummy Company',
            'short_name' => 'dummy',
            'global_role' => null,
            'role_name' => 'Company Admin',
        ],
    ];

    public function run(): void
    {
        foreach ($this->users as $data) {
            $company = Company::create([
                'name' => $data['company_name'],
                'short_name' => $data['short_name']
            ]);

            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['user_name'],
                    'password' => Hash::make('password'),
                    'company_id' => $company->id
                ]
            );

            if ($data['global_role'] == GlobalRoleEnum::SuperAdmin) {
                $user->global_role = $data['global_role'];
                $user->save();
            } else {
                setPermissionsTeamId($company->id);
                $role = Role::firstOrCreate(['name' => $data['role_name'], 'company_id' => $company->id]);

                $role->syncPermissions(PermissionEnum::cases());

                $user->assignRole($role);
            }
        }
    }
}
