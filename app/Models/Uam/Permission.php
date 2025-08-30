<?php

namespace App\Models\Uam;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    // Define the fillable attributes for the Permission model
    protected $fillable = [
        'name',
        'guard_name',
        'company_id',
    ];
}
