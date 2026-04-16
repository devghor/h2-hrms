<?php

namespace App\Models\Payroll;

use App\Models\Employee\Employee\Employee;
use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class PayrollEmployeeSalaryProfile extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'payroll_employee_salary_profiles';

    protected $fillable = [
        'user_id',
        'basic_amount',
        'gross_amount',
        'deduction_amount',
        'net_amount',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active'        => 'boolean',
        'basic_amount'     => 'decimal:2',
        'gross_amount'     => 'decimal:2',
        'deduction_amount' => 'decimal:2',
        'net_amount'       => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PayrollEmployeeSalaryProfileItem::class, 'payroll_employee_salary_profile_id');
    }

    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class, 'user_id', 'user_id');
    }
}
