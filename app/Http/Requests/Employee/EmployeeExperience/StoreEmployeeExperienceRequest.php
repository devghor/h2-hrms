<?php

namespace App\Http\Requests\Employee\EmployeeExperience;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeExperienceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id'          => 'required|integer|exists:users,id',
            'company_name'     => 'required|string|max:255',
            'designation'      => 'nullable|string|max:255',
            'start_date'       => 'nullable|date',
            'end_date'         => 'nullable|date|after_or_equal:start_date',
            'responsibilities' => 'nullable|string',
        ];
    }
}
