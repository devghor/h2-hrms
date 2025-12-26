<?php

namespace App\Http\Requests\Base;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDesignationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $designationId = $this->route('designation');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('designations', 'name')->ignore($designationId)
            ],
            'description' => ['nullable', 'string'],
            'level' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The designation name is required.',
            'name.unique' => 'This designation name already exists.',
            'level.required' => 'The designation level is required.',
            'level.integer' => 'The designation level must be a number.',
            'level.min' => 'The designation level must be at least 1.',
        ];
    }
}
