<?php

namespace App\Services\v1\Uam;

use App\Repositories\v1\Uam\RoleRepository;

class RoleService
{
    protected $roleRepository;

    public function __construct(RoleRepository $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    public function getAllRoles()
    {
        return $this->roleRepository->all();
    }

    public function getRole($id)
    {
        return $this->roleRepository->find($id);
    }

    public function createRole(array $data)
    {
        return $this->roleRepository->create($data);
    }

    public function updateRole($id, array $data)
    {
        return $this->roleRepository->update($data, $id);
    }

    public function deleteRole($id)
    {
        return $this->roleRepository->delete($id);
    }
}
