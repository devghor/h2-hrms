<?php

namespace App\Services\Configuration\Department;

use App\Models\Configuration\Department\Department;
use App\Services\Core\CoreService;

class DepartmentService extends CoreService
{
    protected function model(): string
    {
        return Department::class;
    }
}
