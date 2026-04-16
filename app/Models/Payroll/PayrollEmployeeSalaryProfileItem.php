<?php

namespace App\Models\Payroll;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class PayrollEmployeeSalaryProfileItem extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'payroll_employee_salary_profile_items';

    protected $fillable = [
        'payroll_employee_salary_profile_id',
        'payroll_salary_head_id',
        'amount',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function salaryHead(): BelongsTo
    {
        return $this->belongsTo(PayrollSalaryHead::class, 'payroll_salary_head_id');
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(PayrollEmployeeSalaryProfile::class, 'payroll_employee_salary_profile_id');
    }
}
