<?php

namespace App\Http\Requests\Employee\EmployeeDocument;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id'       => 'required|integer|exists:users,id',
            'document_name' => 'required|string|max:255',
            'document_type' => 'nullable|string|max:100',
            'file_path'     => 'nullable|string|max:500',
        ];
    }
}
