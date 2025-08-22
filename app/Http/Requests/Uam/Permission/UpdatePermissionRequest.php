<?php

namespace App\Http\Requests\Uam\Permission;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePermissionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $permissionId = $this->route('permission')->id ?? null;
        return [
            'name' => 'required|string|max:255|unique:permissions,name,' . $permissionId,
            'guard_name' => 'nullable|string|max:255',
        ];
    }
}
