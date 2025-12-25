<?php

namespace Database\Seeders;

use App\Models\Tenant;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // First seed tenants
        $this->call([
            TenantSeeder::class,
        ]);

        // Seed central database permissions and roles
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
        ]);

        // Seed users in central database
        $this->call([
            UserSeeder::class,
        ]);

        // Seed each tenant's database
        $this->seedTenants();
    }

    /**
     * Seed data for each tenant
     */
    protected function seedTenants(): void
    {
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            $tenant->run(function () {
                // Seed permissions and roles for this tenant
                $this->call([
                    PermissionSeeder::class,
                    RoleSeeder::class,
                ]);

                $this->command->info("Seeded tenant: {$this->getTenantKey()}");
            });
        }
    }

    /**
     * Get current tenant key
     */
    protected function getTenantKey(): string
    {
        return tenancy()->tenant->getTenantKey() ?? 'unknown';
    }
}
