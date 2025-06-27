<?php

declare(strict_types=1);

namespace App\Repositories\v1\Uam;

use App\Models\Uam\User;
use Prettus\Repository\Eloquent\BaseRepository;
use Spatie\QueryBuilder\QueryBuilder;

final class UserRepository extends BaseRepository
{
    public function model()
    {
        return User::class;
    }

    public function getPaginatedUsers(int $perPage)
    {
        return QueryBuilder::for($this->model())
            ->allowedFilters(['name', 'email'])
            ->allowedSorts(['name'])
            ->paginate($perPage);
    }
}
