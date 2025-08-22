<?php

namespace App\Http\Requests\Uam\Role;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoleRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string',
        ];
    }
}
