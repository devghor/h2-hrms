<?php

namespace App\Providers;

use App\Models\Uam\User;
use App\Policies\Uam\UserPolicy;
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

        // Enable password grant type
        Passport::enablePasswordGrant();

        // Passport token expiration
        Passport::tokensExpireIn(CarbonInterval::days(15));
        Passport::refreshTokensExpireIn(CarbonInterval::days(30));
        Passport::personalAccessTokensExpireIn(CarbonInterval::months(6));

    }

    public function registerPolicies(): void
    {
        Gate::policy(User::class, UserPolicy::class);
    }
}
