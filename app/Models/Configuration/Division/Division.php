<?php

namespace App\Models\Configuration\Division;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    protected $table = 'divisions';

    protected $fillable = [
        'name',
        'description',
    ];
}
