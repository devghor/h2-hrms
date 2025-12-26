<?php

namespace App\Enums\Role;

enum RoleEnum: string
{
    case SuperAdmin = 1;
    case TenantAdmin = 2;
}
