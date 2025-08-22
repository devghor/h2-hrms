<?php

namespace App\Enums\Uam\Role;

enum RoleEnum: int
{
    case SuperAdmin = 1;
    case TenantAdmin = 2;
}
