<?php

namespace App\Models\Uam;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    protected $fillable = [
        'name',
        'display_name',
        'module',
        'group',
        'guard_name',
        'company_id',
    ];
}
