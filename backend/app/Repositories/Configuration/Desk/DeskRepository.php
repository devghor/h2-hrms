<?php

namespace App\Repositories\Configuration\Desk;

use App\Models\Configuration\Desk\Desk;
use App\Repositories\Core\CoreRepository;

class DeskRepository extends CoreRepository
{
    public function model(): string
    {
        return Desk::class;
    }

    public function create(array $attributes)
    {
        $model = $this->model->newInstance($attributes);
        $model->save();
        return $model;
    }
}
