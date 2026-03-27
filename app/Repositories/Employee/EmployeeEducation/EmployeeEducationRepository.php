<?php

namespace App\Repositories\Employee\EmployeeEducation;

use App\Models\Employee\EmployeeEducation\EmployeeEducation;
use App\Repositories\Core\CoreRepository;

class EmployeeEducationRepository extends CoreRepository
{
    public function model(): string
    {
        return EmployeeEducation::class;
    }

    public function create(array $attributes)
    {
        $model = $this->model->newInstance($attributes);
        $model->save();

        return $model;
    }
}
