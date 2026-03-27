<?php

namespace App\Repositories\Employee\EmployeeContact;

use App\Models\Employee\EmployeeContact\EmployeeContact;
use App\Repositories\Core\CoreRepository;

class EmployeeContactRepository extends CoreRepository
{
    public function model(): string
    {
        return EmployeeContact::class;
    }

    public function create(array $attributes)
    {
        $model = $this->model->newInstance($attributes);
        $model->save();

        return $model;
    }
}
