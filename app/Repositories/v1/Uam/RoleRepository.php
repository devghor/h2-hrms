<?php

namespace App\Repositories\v1\Uam;

use App\Models\Uam\Role;
use Prettus\Repository\Eloquent\BaseRepository;

class RoleRepository extends BaseRepository
{
    public function model()
    {
        return Role::class;
    }
}
