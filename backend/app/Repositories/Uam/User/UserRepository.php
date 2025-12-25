<?php

namespace App\Repositories\Uam\User;

use App\Models\Uam\User;
use App\Repositories\Core\CoreRepository;

class UserRepository extends CoreRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model(): string
    {
        return User::class;
    }

    /**
     * Update a entity in repository by id
     *
     * @param array $attributes
     * @param       $id
     *
     * @return mixed
     * @throws ValidatorException
     *
     */
    public function update(array $attributes, $id)
    {

        $user = $this->find($id);
        if (array_key_exists('password', $attributes) && empty($attributes['password'])) {
            unset($attributes['password']);
        }

        if (isset($attributes['password_confirmation']) && empty($attributes['password_confirmation'])) {
            unset($attributes['password_confirmation']);
        }

        return $user->update($attributes);
    }

    /**
     * Find user by email
     *
     * @param string $email
     * @return User|null
     */
    public function findUserByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }
}
