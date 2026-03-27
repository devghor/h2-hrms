<?php

namespace App\Http\Requests\Employee\EmployeeExperience;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeExperienceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name'     => 'required|string|max:255',
            'designation'      => 'nullable|string|max:255',
            'start_date'       => 'nullable|date',
            'end_date'         => 'nullable|date|after_or_equal:start_date',
            'responsibilities' => 'nullable|string',
        ];
    }
}
