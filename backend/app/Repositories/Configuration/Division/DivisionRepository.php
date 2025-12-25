<?php

namespace App\Repositories\Configuration\Division;

use App\Models\Configuration\Division\Division;
use App\Repositories\Core\CoreRepository;

class DivisionRepository extends CoreRepository
{
    public function model(): string
    {
        return Division::class;
    }

    public function create(array $attributes)
    {
        $model = $this->model->newInstance($attributes);
        $model->save();
        return $model;
    }
}
