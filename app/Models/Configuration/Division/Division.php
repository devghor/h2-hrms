<?php

namespace App\Models\Configuration\Division;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Division extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'divisions';

    protected $fillable = [
        'name',
        'description',
    ];
}
