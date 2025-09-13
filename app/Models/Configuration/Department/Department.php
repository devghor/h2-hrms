<?php

namespace App\Models\Configuration\Department;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'departments';

    protected $fillable = [
        'name',
        'division_id',
        'description',
    ];

    public function division()
    {
        return $this->belongsTo(\App\Models\Configuration\Division\Division::class);
    }
}
