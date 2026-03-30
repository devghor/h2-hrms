<?php

namespace App\Models\Configuration\Unit;

use App\Models\Configuration\Department\Department;
use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Unit extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'units';

    protected $fillable = [
        'company_id',
        'name',
        'code',
        'department_id',
        'description',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
