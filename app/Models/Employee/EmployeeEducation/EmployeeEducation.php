<?php

namespace App\Models\Employee\EmployeeEducation;

use App\Models\Employee\Employee\Employee;
use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class EmployeeEducation extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'employee_education';

    protected $fillable = [
        'employee_id',
        'degree',
        'institution',
        'year_of_passing',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
