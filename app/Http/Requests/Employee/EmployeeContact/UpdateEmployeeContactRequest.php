<?php

namespace App\Http\Requests\Employee\EmployeeContact;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'contact_name' => 'required|string|max:255',
            'relationship' => 'nullable|string|max:100',
            'phone'        => 'nullable|string|max:50',
        ];
    }
}
