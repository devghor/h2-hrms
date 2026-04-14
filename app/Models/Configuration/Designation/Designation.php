<?php

namespace App\Models\Configuration\Designation;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Designation extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'designations';

    protected $fillable = [
        'name',
        'code',
        'description',
        'position',
    ];
}
