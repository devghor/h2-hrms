<?php

namespace App\Policies\Uam;

use App\Models\Uam\User;

class UserPolicy
{
    /**
     * Determine if the user can view any users.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('READ_UAM_USER');
    }

    /**
     * Determine if the user can view a specific user.
     */
    public function view(User $user, User $model): bool
    {
        // Users can view their own profile or if they have permission
        return $user->id === $model->id || $user->hasPermissionTo('READ_UAM_USER');
    }

    /**
     * Determine if the user can create users.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('CREATE_UAM_USER');
    }

    /**
     * Determine if the user can update a user.
     */
    public function update(User $user, User $model): bool
    {
        // Users can update their own profile or if they have permission
        return $user->id === $model->id || $user->hasPermissionTo('UPDATE_UAM_USER');
    }

    /**
     * Determine if the user can delete a user.
     */
    public function delete(User $user, User $model): bool
    {
        // Cannot delete yourself
        if ($user->id === $model->id) {
            return false;
        }

        return $user->hasPermissionTo('DELETE_UAM_USER');
    }

    /**
     * Determine if the user can restore a user.
     */
    public function restore(User $user, User $model): bool
    {
        return $user->hasPermissionTo('UPDATE_UAM_USER');
    }

    /**
     * Determine if the user can permanently delete a user.
     */
    public function forceDelete(User $user, User $model): bool
    {
        // Only super admin should be able to force delete
        return $user->hasRole('Super Admin') && $user->hasPermissionTo('DELETE_UAM_USER');
    }
}
