<?php

namespace App\Services\Payroll;

use App\Models\Payroll\PayrollSalaryHead;
use App\Services\Core\CoreService;

class PayrollSalaryHeadService extends CoreService
{
    protected function model(): string
    {
        return PayrollSalaryHead::class;
    }
}
