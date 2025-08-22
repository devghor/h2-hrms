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
}
