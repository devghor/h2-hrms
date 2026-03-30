<?php

namespace App\Services\Configuration\Department;

use App\Models\Configuration\Department\Department;
use App\Services\Core\CoreService;
use Illuminate\Database\Eloquent\Collection;

class DepartmentService extends CoreService
{
    protected function model(): string
    {
        return Department::class;
    }

    public function getDepartmentOptions(): Collection
    {
        return $this->model->select('id', 'name')->get();
    }
}
