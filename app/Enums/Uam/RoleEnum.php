<?php

namespace App\Enums\Uam;

enum RoleEnum: string
{
    case SuperAdmin = 'super-admin';
    case TenantAdmin = 'tenant-admin';
}
