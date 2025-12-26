<?php

namespace App\Policies\Base;

use App\Models\Base\Designation;
use App\Models\Uam\User;

class DesignationPolicy
{
    /**
     * Determine whether the user can view any designations.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('READ_BASE_DESIGNATION');
    }

    /**
     * Determine whether the user can view the designation.
     */
    public function view(User $user, Designation $designation): bool
    {
        return $user->can('READ_BASE_DESIGNATION');
    }

    /**
     * Determine whether the user can create designations.
     */
    public function create(User $user): bool
    {
        return $user->can('CREATE_BASE_DESIGNATION');
    }

    /**
     * Determine whether the user can update the designation.
     */
    public function update(User $user, Designation $designation): bool
    {
        return $user->can('UPDATE_BASE_DESIGNATION');
    }

    /**
     * Determine whether the user can delete the designation.
     */
    public function delete(User $user, Designation $designation): bool
    {
        return $user->can('DELETE_BASE_DESIGNATION');
    }

    /**
     * Determine whether the user can restore the designation.
     */
    public function restore(User $user, Designation $designation): bool
    {
        return $user->can('RESTORE_BASE_DESIGNATION');
    }

    /**
     * Determine whether the user can permanently delete the designation.
     */
    public function forceDelete(User $user, Designation $designation): bool
    {
        return $user->can('FORCE_DELETE_BASE_DESIGNATION');
    }
}
