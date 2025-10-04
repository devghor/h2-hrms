<?php

namespace App\Repositories\Uam\Role;

use App\Models\Uam\Role;
use App\Repositories\Core\CoreRepository;

class RoleRepository  extends CoreRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model(): string
    {
        return Role::class;
    }

    /**
     * Update a entity in repository by id
     *
     * @param array $attributes
     * @param       $id
     *
     * @return mixed
     * @throws ValidatorException
     *
     */
    public function update(array $attributes, $id)
    {
        $role = parent::update($attributes, $id);

        if (isset($attributes['permissions']) && is_array($attributes['permissions'])) {
            $role->syncPermissions($attributes['permissions']);
        } else {
            $role->syncPermissions([]);
        }

        return $role;
    }
}
