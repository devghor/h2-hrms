<?php

namespace App\Services\User;

use App\Repositories\User\UserRepository;

class UserService
{
    public function __construct(private UserRepository $userRepository) {}

    public function storeUser(array $data = [])
    {
        return $this->userRepository->create($data);
    }
}
