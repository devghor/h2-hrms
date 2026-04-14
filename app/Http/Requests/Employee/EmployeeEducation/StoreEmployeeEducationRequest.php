<?php

namespace App\Http\Requests\Employee\EmployeeEducation;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeEducationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id'         => 'required|integer|exists:users,id',
            'degree'          => 'required|string|max:255',
            'institution'     => 'nullable|string|max:255',
            'year_of_passing' => 'nullable|integer|min:1900|max:2100',
        ];
    }
}
