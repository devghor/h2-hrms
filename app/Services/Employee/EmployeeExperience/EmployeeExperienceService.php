<?php

namespace App\Services\Employee\EmployeeExperience;

use App\Models\Employee\EmployeeExperience\EmployeeExperience;
use App\Services\Core\CoreService;

class EmployeeExperienceService extends CoreService
{
    protected function model(): string
    {
        return EmployeeExperience::class;
    }
}
