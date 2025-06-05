<?php

declare(strict_types=1);

namespace App\Repositories\User;

use App\Models\User;
use Prettus\Repository\Eloquent\BaseRepository;

final class UserRepository extends BaseRepository
{
    public function model()
    {
        return User::class;
    }
}
