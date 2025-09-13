<?php

namespace App\Models\Configuration\Desk;

use Illuminate\Database\Eloquent\Model;

class Desk extends Model
{
    protected $table = 'desks';

    protected $fillable = [
        'name',
        'parent_id',
        'description',
    ];
}
