<?php

namespace App\Repositories\Core;

use Prettus\Repository\Eloquent\BaseRepository;

abstract class CoreRepository extends BaseRepository
{
    public function bulkDelete(array $ids): int
    {
        return $this->model->whereIn('id', $ids)->delete();
    }
}
