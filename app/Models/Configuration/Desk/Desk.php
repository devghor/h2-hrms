<?php

namespace App\Models\Configuration\Desk;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Desk extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'desks';

    protected $fillable = [
        'name',
        'parent_id',
        'description',
    ];
}
