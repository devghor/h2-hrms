<?php

namespace App\Http\Requests\Employee\EmployeeContact;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id'  => 'required|integer|exists:employees,id',
            'contact_name' => 'required|string|max:255',
            'relationship' => 'nullable|string|max:100',
            'phone'        => 'nullable|string|max:50',
        ];
    }
}
