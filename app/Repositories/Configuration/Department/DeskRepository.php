<?php

namespace App\Repositories\Configuration\Department;

use App\Models\Configuration\Department\Desk;
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
