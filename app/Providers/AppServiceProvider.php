<?php

namespace App\Providers;

use App\Models\Uam\User;
use App\Models\Uam\Role;
use App\Models\Uam\Permission;
use App\Policies\Uam\UserPolicy;
use App\Policies\Uam\RolePolicy;
use App\Policies\Uam\PermissionPolicy;
use Carbon\CarbonInterval;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }

    public function registerPolicies(): void
    {
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(Permission::class, PermissionPolicy::class);
    }
}
