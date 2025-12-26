<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait HasPermissionCache
{
    /**
     * Check if user has permission with caching
     *
     * @param string|array $permissions
     * @param string $guard
     * @return bool
     */
    public function hasPermissionCached($permissions, string $guard = null): bool
    {
        $guard = $guard ?? $this->guard_name ?? config('auth.defaults.guard');
        $permissions = is_array($permissions) ? $permissions : [$permissions];

        $cacheKey = "user.{$this->id}.permissions";

        // Cache user permissions for 1 hour
        $userPermissions = Cache::remember($cacheKey, 3600, function () use ($guard) {
            return $this->getAllPermissions()->pluck('name')->toArray();
        });

        foreach ($permissions as $permission) {
            if (in_array($permission, $userPermissions)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Clear permission cache for user
     */
    public function clearPermissionCache(): void
    {
        Cache::forget("user.{$this->id}.permissions");
        Cache::forget("user.{$this->id}.roles");
    }

    /**
     * Check if user has role with caching
     *
     * @param string|array $roles
     * @return bool
     */
    public function hasRoleCached($roles): bool
    {
        $roles = is_array($roles) ? $roles : [$roles];
        $cacheKey = "user.{$this->id}.roles";

        // Cache user roles for 1 hour
        $userRoles = Cache::remember($cacheKey, 3600, function () {
            return $this->roles->pluck('name')->toArray();
        });

        foreach ($roles as $role) {
            if (in_array($role, $userRoles)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get all user permissions (direct and via roles) with caching
     */
    public function getAllPermissionsCached()
    {
        $cacheKey = "user.{$this->id}.all_permissions";

        return Cache::remember($cacheKey, 3600, function () {
            return $this->getAllPermissions();
        });
    }
}
