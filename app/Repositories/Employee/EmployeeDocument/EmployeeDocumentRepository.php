<?php

namespace App\Repositories\Employee\EmployeeDocument;

use App\Models\Employee\EmployeeDocument\EmployeeDocument;
use App\Repositories\Core\CoreRepository;

class EmployeeDocumentRepository extends CoreRepository
{
    public function model(): string
    {
        return EmployeeDocument::class;
    }

    public function create(array $attributes)
    {
        $model = $this->model->newInstance($attributes);
        $model->save();

        return $model;
    }
}
