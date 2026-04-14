<?php

namespace App\Http\Requests\Employee\Employee;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
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
            'email'             => 'nullable|email|max:255',
            'phone'             => 'nullable|string|max:50',
            'date_of_birth'     => 'nullable|date',
            'gender'            => 'nullable|string|max:20',
            'hire_date'         => 'nullable|date',
            'employment_status' => 'nullable|string|max:50',
            'department_id'     => 'nullable|integer|exists:departments,id',
            'designation_id'    => 'nullable|integer|exists:desks,id',
            'manager_user_id'   => 'nullable|integer|exists:users,id',
            'address'           => 'nullable|string',
            'city'              => 'nullable|string|max:100',
            'country'           => 'nullable|string|max:100',
            'status'            => 'nullable|boolean',
        ];
    }
}
