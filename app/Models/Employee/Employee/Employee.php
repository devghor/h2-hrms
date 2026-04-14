<?php

namespace App\Models\Employee\Employee;

use App\Models\Configuration\Department\Department;
use App\Models\Configuration\Desk\Desk;
use App\Models\Employee\EmployeeContact\EmployeeContact;
use App\Models\Employee\EmployeeDocument\EmployeeDocument;
use App\Models\Employee\EmployeeEducation\EmployeeEducation;
use App\Models\Employee\EmployeeExperience\EmployeeExperience;
use App\Enums\Employee\EmployeeStatusEnum;
use App\Enums\Employee\EmployeeTypeEnum;
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
        'user_id',
        'employee_code',
        'first_name',
        'last_name',
        'full_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'hire_date',
        'employee_type',
        'employee_status',
        'department_id',
        'designation_id',
        'manager_user_id',
        'address',
        'city',
        'country',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'date_of_birth'   => 'date',
        'hire_date'       => 'date',
        'employee_type'   => EmployeeTypeEnum::class,
        'employee_status' => EmployeeStatusEnum::class,
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
        return $this->belongsTo(Employee::class, 'manager_user_id', 'user_id');
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(EmployeeContact::class, 'user_id', 'user_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(EmployeeDocument::class, 'user_id', 'user_id');
    }

    public function education(): HasMany
    {
        return $this->hasMany(EmployeeEducation::class, 'user_id', 'user_id');
    }

    public function experience(): HasMany
    {
        return $this->hasMany(EmployeeExperience::class, 'user_id', 'user_id');
    }
}
