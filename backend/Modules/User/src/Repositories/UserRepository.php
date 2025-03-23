<?php

namespace Modules\User\Repositories;

use App\Models\User;
use Modules\Base\Repositories\Repository;

class UserRepository extends Repository
{
    function model()
    {
        return User::class;
    }
}
