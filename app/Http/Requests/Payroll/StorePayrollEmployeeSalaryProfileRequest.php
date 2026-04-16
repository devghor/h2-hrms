<?php

namespace App\Http\Requests\Payroll;

use Illuminate\Foundation\Http\FormRequest;

class StorePayrollEmployeeSalaryProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id'                          => ['required', 'integer', 'exists:users,id'],
            'basic_amount'                     => ['required', 'numeric', 'min:0'],
            'gross_amount'                     => ['required', 'numeric', 'min:0'],
            'deduction_amount'                 => ['required', 'numeric', 'min:0'],
            'net_amount'                       => ['required', 'numeric', 'min:0'],
            'items'                            => ['required', 'array'],
            'items.*.payroll_salary_head_id'   => ['required', 'integer', 'exists:payroll_salary_heads,id'],
            'items.*.amount'                   => ['required', 'numeric', 'min:0'],
        ];
    }
}
