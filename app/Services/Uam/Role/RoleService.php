<?php

namespace App\Services\Uam\Role;

use App\Models\Uam\Role;
use App\Services\Core\CoreService;
use Illuminate\Database\Eloquent\Model;

class RoleService extends CoreService
{
    protected function model(): string
    {
        return Role::class;
    }

    public function update(array $data, $id): Model
    {
        $role = $this->find($id);
        $role->update($data);
        $role->syncPermissions($data['permissions'] ?? []);

        return $role;
    }
}
