<?php

namespace App\Models\Uam;

use Illuminate\Database\Eloquent\Model;

class PermissionGroup extends Model
{
    protected $fillable = ['module', 'submodule'];

    public function permissions()
    {
        return $this->hasMany(Permission::class);
    }
}
