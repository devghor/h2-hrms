<?php

namespace App\Http\Requests\Uam\Role;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $roleId = $this->route('role')->id ?? null;
        return [
            'name' => 'required|string|max:255|unique:roles,name,' . $roleId,
            'description' => 'nullable|string',
        ];
    }
}
