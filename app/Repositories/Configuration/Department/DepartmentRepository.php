<?php

namespace App\Repositories\Configuration\Department;

use App\Models\Configuration\Department\Department;
use App\Repositories\Core\CoreRepository;

class DepartmentRepository extends CoreRepository
{
    public function model(): string
    {
        return Department::class;
    }

    public function create(array $attributes)
    {
        $model = $this->model->newInstance($attributes);
        $model->save();
        return $model;
    }
}
