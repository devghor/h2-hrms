<?php

namespace App\Services\Employee\EmployeeContact;

use App\Models\Employee\EmployeeContact\EmployeeContact;
use App\Services\Core\CoreService;

class EmployeeContactService extends CoreService
{
    protected function model(): string
    {
        return EmployeeContact::class;
    }
}
