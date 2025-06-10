<?php

declare(strict_types=1);

namespace App\Repositories\User;

use App\Models\User;
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
            ->orderBy('created_at', 'desc')
            ->allowedFilters(['name', 'email'])
            ->paginate($perPage);
    }
}
