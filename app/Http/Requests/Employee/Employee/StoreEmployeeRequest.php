<?php

namespace App\Http\Requests\Employee\Employee;

use App\Enums\Employee\EmployeeStatusEnum;
use App\Enums\Employee\EmployeeTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name'        => 'required|string|max:255',
            'last_name'         => 'required|string|max:255',
            'full_name'         => 'nullable|string|max:255',
            'employee_code'     => 'nullable|string|max:100',
            'email'             => 'required|email|max:255|unique:users,email',
            'phone'             => 'nullable|string|max:50',
            'date_of_birth'     => 'nullable|date',
            'gender'            => 'nullable|string|max:20',
            'hire_date'       => 'nullable|date',
            'employee_type'   => ['nullable', new Enum(EmployeeTypeEnum::class)],
            'employee_status' => ['nullable', new Enum(EmployeeStatusEnum::class)],
            'department_id'   => 'nullable|integer|exists:departments,id',
            'designation_id'    => 'nullable|exists:designations,id',
            'manager_user_id'   => 'nullable|exists:users,id',
            'address'           => 'nullable|string',
            'city'              => 'nullable|string|max:100',
            'country'           => 'nullable|string|max:100',
        ];
    }
}
