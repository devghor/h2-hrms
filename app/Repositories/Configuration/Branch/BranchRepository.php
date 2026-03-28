<?php

namespace App\Repositories\Configuration\Branch;

use App\Models\Configuration\Branch\Branch;
use App\Repositories\Core\CoreRepository;

class BranchRepository extends CoreRepository
{
    public function model(): string
    {
        return Branch::class;
    }

    public function create(array $attributes)
    {
        $model = $this->model->newInstance($attributes);
        $model->save();
        return $model;
    }

    public function getBranchOptions()
    {
        return $this->model->select('id', 'name')->get();
    }
}
