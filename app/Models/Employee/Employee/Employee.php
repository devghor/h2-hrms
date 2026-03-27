<?php

namespace App\Models\Employee\Employee;

use App\Models\Configuration\Department\Department;
use App\Models\Configuration\Desk\Desk;
use App\Models\Employee\EmployeeContact\EmployeeContact;
use App\Models\Employee\EmployeeDocument\EmployeeDocument;
use App\Models\Employee\EmployeeEducation\EmployeeEducation;
use App\Models\Employee\EmployeeExperience\EmployeeExperience;
use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Employee extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'employees';

    protected $fillable = [
        'employee_code',
        'first_name',
        'last_name',
        'full_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'hire_date',
        'employment_status',
        'department_id',
        'designation_id',
        'manager_id',
        'address',
        'city',
        'country',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'hire_date' => 'date',
        'status' => 'boolean',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function designation(): BelongsTo
    {
        return $this->belongsTo(Desk::class, 'designation_id');
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(EmployeeContact::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(EmployeeDocument::class);
    }

    public function education(): HasMany
    {
        return $this->hasMany(EmployeeEducation::class);
    }

    public function experience(): HasMany
    {
        return $this->hasMany(EmployeeExperience::class);
    }
}
