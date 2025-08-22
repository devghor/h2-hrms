<?php

namespace App\Repositories\Uam\Permission;

use App\Models\Uam\Permission;
use App\Repositories\Core\CoreRepository;

class PermissionRepository extends CoreRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model(): string
    {
        return Permission::class;
    }
}
