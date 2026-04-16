<?php

namespace App\Services\Payroll;

use App\Models\Payroll\PayrollSalaryStructure;
use App\Services\Core\CoreService;

class PayrollSalaryStructureService extends CoreService
{
    protected function model(): string
    {
        return PayrollSalaryStructure::class;
    }
}
