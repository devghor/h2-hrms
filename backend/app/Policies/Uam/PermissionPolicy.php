<?php

namespace App\Policies\Uam;

use App\Models\Uam\Permission;
use App\Models\Uam\User;

class PermissionPolicy
{
    /**
     * Determine if the user can view any permissions.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('READ_UAM_PERMISSION');
    }

    /**
     * Determine if the user can view a specific permission.
     */
    public function view(User $user, Permission $permission): bool
    {
        return $user->hasPermissionTo('READ_UAM_PERMISSION');
    }

    /**
     * Determine if the user can create permissions.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('CREATE_UAM_PERMISSION');
    }

    /**
     * Determine if the user can update a permission.
     */
    public function update(User $user, Permission $permission): bool
    {
        return $user->hasPermissionTo('UPDATE_UAM_PERMISSION');
    }

    /**
     * Determine if the user can delete a permission.
     */
    public function delete(User $user, Permission $permission): bool
    {
        return $user->hasPermissionTo('DELETE_UAM_PERMISSION');
    }
}
