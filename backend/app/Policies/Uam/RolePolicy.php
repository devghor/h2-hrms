<?php

namespace App\Policies\Uam;

use App\Models\Uam\Role;
use App\Models\Uam\User;

class RolePolicy
{
    /**
     * Determine if the user can view any roles.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can view a specific role.
     */
    public function view(User $user, Role $role): bool
    {
        return true;
    }

    /**
     * Determine if the user can create roles.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can update a role.
     */
    public function update(User $user, Role $role): bool
    {
        return true;
    }

    /**
     * Determine if the user can delete a role.
     */
    public function delete(User $user, Role $role): bool
    {
        // Prevent deletion of system roles
        if (in_array($role->name, ['Super Admin', 'Admin'])) {
            return false;
        }

        return true;
    }
}
