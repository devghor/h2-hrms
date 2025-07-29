<?php

namespace App\Models\Uam;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as ModelsRole;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Role extends ModelsRole
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'name',
        'guard_name',
    ];
}
