<?php

namespace App\Http\Requests\Payroll;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePayrollSalaryStructureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'designation_id'              => 'required|integer|exists:designations,id',
            'basic'                       => 'required|numeric|min:0',
            'annual_increment_percentage' => 'required|numeric|min:0|max:100',
            'efficiency_bar'              => 'nullable|numeric|min:0',
            'home_loan_multiplier'        => 'nullable|numeric|min:0',
            'car_loan_max_amount'         => 'nullable|numeric|min:0',
            'car_maintenance_expense'     => 'nullable|numeric|min:0',
            'life_insurance_multiplier'   => 'nullable|numeric|min:0',
            'hospitalization_insurance'   => 'nullable|numeric|min:0',
            'effective_date'              => 'required|date',
            'is_active'                   => 'boolean',
        ];
    }
}
