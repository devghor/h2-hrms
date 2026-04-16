<?php

namespace App\Models\Payroll;

use App\Enums\Payroll\SalaryHeadCategoryEnum;
use App\Enums\Payroll\SalaryHeadGlPrefixTypeEnum;
use App\Enums\Payroll\SalaryHeadIdentificationTypeEnum;
use App\Enums\Payroll\SalaryHeadModeEnum;
use App\Enums\Payroll\SalaryHeadTaxCalculationTypeEnum;
use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class PayrollSalaryHead extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'payroll_salary_heads';

    protected $fillable = [
        'name',
        'code',
        'is_basic_linked',
        'basic_ratio',
        'mode',
        'gl_account_code',
        'gl_prefix_type',
        'identification_type',
        'category',
        'position',
        'is_variable',
        'is_taxable',
        'tax_calculation_type',
        'tax_value',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_basic_linked'      => 'boolean',
        'is_variable'          => 'boolean',
        'is_taxable'           => 'boolean',
        'is_active'            => 'boolean',
        'mode'                 => SalaryHeadModeEnum::class,
        'gl_prefix_type'       => SalaryHeadGlPrefixTypeEnum::class,
        'identification_type'  => SalaryHeadIdentificationTypeEnum::class,
        'category'             => SalaryHeadCategoryEnum::class,
        'tax_calculation_type' => SalaryHeadTaxCalculationTypeEnum::class,
    ];
}
