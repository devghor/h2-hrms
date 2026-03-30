<?php

namespace App\Http\Requests\Configuration\Unit;

use Illuminate\Foundation\Http\FormRequest;

class StoreUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => 'nullable|integer',
            'name'       => 'required|string|max:255',
            'code'       => 'nullable|string|max:100',
            'department_id' => 'nullable|integer|exists:departments,id',
            'description' => 'nullable|string',
        ];
    }
}
