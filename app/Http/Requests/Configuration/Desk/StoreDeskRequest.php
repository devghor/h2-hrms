<?php

namespace App\Http\Requests\Configuration\Desk;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|integer|exists:desks,id',
            'description' => 'nullable|string',
        ];
    }
}
