<?php

namespace App\Models\Uam;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission as ModelsPermission;

class Permission extends ModelsPermission
{
    use HasFactory;

    protected $fillable = [
        'name',
        'guard_name',
    ];
}
