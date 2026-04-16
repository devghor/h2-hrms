<?php

namespace App\Models\Payroll;

use App\Models\Configuration\Designation\Designation;
use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class PayrollSalaryStructure extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'payroll_salary_structures';

    protected $fillable = [
        'designation_id',
        'basic',
        'annual_increment_percentage',
        'efficiency_bar',
        'home_loan_multiplier',
        'car_loan_max_amount',
        'car_maintenance_expense',
        'life_insurance_multiplier',
        'hospitalization_insurance',
        'effective_date',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active'                   => 'boolean',
        'effective_date'              => 'date:Y-m-d',
        'basic'                       => 'decimal:2',
        'annual_increment_percentage' => 'decimal:4',
        'efficiency_bar'              => 'decimal:2',
        'home_loan_multiplier'        => 'decimal:4',
        'car_loan_max_amount'         => 'decimal:2',
        'car_maintenance_expense'     => 'decimal:2',
        'life_insurance_multiplier'   => 'decimal:4',
        'hospitalization_insurance'   => 'decimal:2',
    ];

    public function designation(): BelongsTo
    {
        return $this->belongsTo(Designation::class);
    }
}
