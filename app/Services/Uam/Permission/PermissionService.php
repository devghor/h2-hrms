<?php

namespace App\Services\Uam\Permission;

use App\Models\Uam\Permission;
use App\Services\Core\CoreService;

class PermissionService extends CoreService
{
    protected function model(): string
    {
        return Permission::class;
    }
}
