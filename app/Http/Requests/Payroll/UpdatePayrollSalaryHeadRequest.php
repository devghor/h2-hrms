<?php

namespace App\Http\Requests\Payroll;

use App\Enums\Payroll\SalaryHeadCategoryEnum;
use App\Enums\Payroll\SalaryHeadGlPrefixTypeEnum;
use App\Enums\Payroll\SalaryHeadIdentificationTypeEnum;
use App\Enums\Payroll\SalaryHeadModeEnum;
use App\Enums\Payroll\SalaryHeadTaxCalculationTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdatePayrollSalaryHeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                 => 'required|string|max:255',
            'code'                 => 'nullable|string|max:100',
            'is_basic_linked'      => 'boolean',
            'basic_ratio'          => 'nullable|numeric|min:0|max:100',
            'mode'                 => ['required', new Enum(SalaryHeadModeEnum::class)],
            'gl_account_code'      => 'nullable|string|max:100',
            'gl_prefix_type'       => ['required', new Enum(SalaryHeadGlPrefixTypeEnum::class)],
            'identification_type'  => ['required', new Enum(SalaryHeadIdentificationTypeEnum::class)],
            'category'             => ['required', new Enum(SalaryHeadCategoryEnum::class)],
            'position'             => 'nullable|integer|min:0',
            'is_variable'          => 'boolean',
            'is_taxable'           => 'boolean',
            'tax_calculation_type' => ['required', new Enum(SalaryHeadTaxCalculationTypeEnum::class)],
            'tax_value'            => 'nullable|numeric|min:0',
            'is_active'            => 'boolean',
        ];
    }
}
