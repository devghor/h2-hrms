<?php

namespace App\Models\Employee\EmployeeEducation;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class EmployeeEducation extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'employee_education';

    protected $fillable = [
        'user_id',
        'degree',
        'institution',
        'year_of_passing',
    ];
}
