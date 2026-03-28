<?php

namespace App\Http\Requests\Configuration\Branch;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => 'required|integer|exists:companies,id',
            'name'       => 'required|string|max:255',
            'short_name' => 'nullable|string|max:255',
            'code'       => 'nullable|string|max:50',
            'address'    => 'nullable|string|max:500',
            'phone'      => 'nullable|string|max:20',
            'mobile'     => 'nullable|string|max:20',
            'email'      => 'nullable|email|max:255',
        ];
    }
}
