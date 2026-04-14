<?php

namespace App\Models\Employee\EmployeeExperience;

use App\Models\Employee\Employee\Employee;
use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class EmployeeExperience extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'employee_experience';

    protected $fillable = [
        'user_id',
        'company_name',
        'designation',
        'start_date',
        'end_date',
        'responsibilities',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}
