<?php

namespace App\Services\Uam;

use App\Models\Uam\Permission;
use App\Models\Uam\Role;
use App\Models\Uam\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class PermissionService
{
    /**
     * Assign permissions to a role
     *
     * @param Role $role
     * @param array $permissionNames
     * @return void
     */
    public function assignPermissionsToRole(Role $role, array $permissionNames): void
    {
        $permissions = Permission::whereIn('name', $permissionNames)->get();
        $role->syncPermissions($permissions);

        // Clear cache for all users with this role
        $this->clearRolePermissionCache($role);
    }

    /**
     * Assign roles to a user
     *
     * @param User $user
     * @param array $roleNames
     * @return void
     */
    public function assignRolesToUser(User $user, array $roleNames): void
    {
        $user->syncRoles($roleNames);
        $user->clearPermissionCache();
    }

    /**
     * Assign direct permissions to a user
     *
     * @param User $user
     * @param array $permissionNames
     * @return void
     */
    public function assignPermissionsToUser(User $user, array $permissionNames): void
    {
        $permissions = Permission::whereIn('name', $permissionNames)->get();
        $user->syncPermissions($permissions);
        $user->clearPermissionCache();
    }

    /**
     * Get all permissions grouped by module
     *
     * @return array
     */
    public function getPermissionsGroupedByModule(): array
    {
        return Cache::remember('permissions.grouped.module', 3600, function () {
            return Permission::all()
                ->groupBy('module')
                ->map(function ($permissions) {
                    return $permissions->groupBy('group');
                })
                ->toArray();
        });
    }

    /**
     * Get user permissions with details
     *
     * @param User $user
     * @return array
     */
    public function getUserPermissions(User $user): array
    {
        $cacheKey = "user.{$user->id}.permissions_detailed";

        return Cache::remember($cacheKey, 3600, function () use ($user) {
            $permissions = $user->getAllPermissions();

            return [
                'direct_permissions' => $user->permissions->pluck('name')->toArray(),
                'role_permissions' => $user->getPermissionsViaRoles()->pluck('name')->toArray(),
                'all_permissions' => $permissions->pluck('name')->toArray(),
                'permissions_by_module' => $permissions->groupBy('module')->map(function ($perms) {
                    return $perms->pluck('name')->toArray();
                })->toArray(),
            ];
        });
    }

    /**
     * Check if user can perform action on resource
     *
     * @param User $user
     * @param string $action (create, read, update, delete)
     * @param string $resource (e.g., 'UAM_USER', 'CONFIGURATION_BRANCH')
     * @return bool
     */
    public function userCan(User $user, string $action, string $resource): bool
    {
        $permissionName = strtoupper("{$action}_{$resource}");
        return $user->hasPermissionTo($permissionName);
    }

    /**
     * Clear permission cache for all users with a specific role
     *
     * @param Role $role
     * @return void
     */
    protected function clearRolePermissionCache(Role $role): void
    {
        $users = $role->users;

        foreach ($users as $user) {
            $user->clearPermissionCache();
        }
    }

    /**
     * Create a new permission
     *
     * @param array $data
     * @return Permission
     */
    public function createPermission(array $data): Permission
    {
        $permission = Permission::create([
            'name' => $data['name'],
            'display_name' => $data['display_name'] ?? null,
            'module' => $data['module'] ?? null,
            'group' => $data['group'] ?? null,
            'guard_name' => $data['guard_name'] ?? 'api',
        ]);

        // Clear permissions cache
        Cache::forget('permissions.grouped.module');

        return $permission;
    }

    /**
     * Create a new role with permissions
     *
     * @param array $data
     * @param array $permissionNames
     * @return Role
     */
    public function createRole(array $data, array $permissionNames = []): Role
    {
        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'api',
            'description' => $data['description'] ?? null,
        ]);

        if (!empty($permissionNames)) {
            $this->assignPermissionsToRole($role, $permissionNames);
        }

        return $role;
    }

    /**
     * Sync user permissions from array of modules
     * Useful for bulk permission assignment based on modules
     *
     * @param User $user
     * @param array $modules ['Uam' => ['create', 'read'], 'Configuration' => ['read']]
     * @return void
     */
    public function syncUserPermissionsByModules(User $user, array $modules): void
    {
        $permissionNames = [];

        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                $pattern = strtoupper($action) . '_' . strtoupper($module) . '_%';
                $permissions = Permission::where('name', 'like', $pattern)->pluck('name')->toArray();
                $permissionNames = array_merge($permissionNames, $permissions);
            }
        }

        $this->assignPermissionsToUser($user, array_unique($permissionNames));
    }
}
