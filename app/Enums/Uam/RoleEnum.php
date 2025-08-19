<?php

namespace App\Enums\Uam;

enum RoleEnum: int
{
    case SuperAdmin = 1;
    case TenantAdmin = 2;
}
