<?php

namespace App\Repositories\Employee\EmployeeExperience;

use App\Models\Employee\EmployeeExperience\EmployeeExperience;
use App\Repositories\Core\CoreRepository;

class EmployeeExperienceRepository extends CoreRepository
{
    public function model(): string
    {
        return EmployeeExperience::class;
    }

    public function create(array $attributes)
    {
        $model = $this->model->newInstance($attributes);
        $model->save();

        return $model;
    }
}
