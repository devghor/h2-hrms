<?php

namespace App\Models\Configuration\Department;

use App\Models\Configuration\Division\Division;
use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Department extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'departments';

    protected $fillable = [
        'name',
        'division_id',
        'description',
    ];

    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}
