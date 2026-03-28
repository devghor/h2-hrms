<?php

namespace App\Services\Employee\EmployeeEducation;

use App\Models\Employee\EmployeeEducation\EmployeeEducation;
use App\Services\Core\CoreService;

class EmployeeEducationService extends CoreService
{
    protected function model(): string
    {
        return EmployeeEducation::class;
    }
}
