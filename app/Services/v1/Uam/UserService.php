<?php

namespace App\Services\v1\Uam;

use Exception;
use App\Repositories\v1\Uam\UserRepository;

class UserService
{
    public function __construct(private UserRepository $userRepository) {}

    public function getUser(int $id)
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            throw new Exception("User not found", 404);
        }

        return $user;
    }

    public function storeUser(array $data = [])
    {
        return $this->userRepository->create($data);
    }

    public function getPaginatedUsers(int $perPage)
    {
        return $this->userRepository->getPaginatedUsers($perPage);
    }

    public function updateUser(int $id, array $data = [])
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            throw new Exception("User not found", 404);
        }

        return $this->userRepository->update($data, $id);
    }

    public function deleteUser(int $id)
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            throw new Exception("User not found", 404);
        }

        return $this->userRepository->delete($id);
    }
}
