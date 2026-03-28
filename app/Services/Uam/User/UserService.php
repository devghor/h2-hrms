<?php

namespace App\Services\Uam\User;

use App\Models\Uam\User;
use App\Services\Core\CoreService;
use Illuminate\Database\Eloquent\Model;

class UserService extends CoreService
{
    protected function model(): string
    {
        return User::class;
    }

    public function update(array $data, $id): Model
    {
        $user = $this->find($id);

        if (array_key_exists('password', $data) && empty($data['password'])) {
            unset($data['password']);
        }

        if (isset($data['password_confirmation']) && empty($data['password_confirmation'])) {
            unset($data['password_confirmation']);
        }

        $user->update($data);

        return $user;
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }
}
