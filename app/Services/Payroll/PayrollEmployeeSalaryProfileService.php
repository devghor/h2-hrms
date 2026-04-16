<?php

namespace App\Services\Payroll;

use App\Enums\Payroll\SalaryHeadCategoryEnum;
use App\Models\Employee\Employee\Employee;
use App\Models\Payroll\PayrollEmployeeSalaryProfile;
use App\Models\Payroll\PayrollSalaryHead;
use App\Models\Payroll\PayrollSalaryStructure;
use App\Services\Core\CoreService;

class PayrollEmployeeSalaryProfileService extends CoreService
{
    protected function model(): string
    {
        return PayrollEmployeeSalaryProfile::class;
    }

    public function createProfile(int $userId, array $items, float $basicAmount, float $grossAmount, float $deductionAmount, float $netAmount): PayrollEmployeeSalaryProfile
    {
        PayrollEmployeeSalaryProfile::where('user_id', $userId)->update(['is_active' => false]);

        $profile = $this->model->create([
            'user_id'          => $userId,
            'basic_amount'     => $basicAmount,
            'gross_amount'     => $grossAmount,
            'deduction_amount' => $deductionAmount,
            'net_amount'       => $netAmount,
            'is_active'        => true,
        ]);

        $profile->items()->createMany($items);

        return $profile;
    }

    public function getActiveProfile(int $userId): ?PayrollEmployeeSalaryProfile
    {
        return PayrollEmployeeSalaryProfile::where('user_id', $userId)
            ->where('is_active', true)
            ->with('items.salaryHead')
            ->first();
    }

    public function getSalaryDataForEmployee(int $userId): array
    {
        $employee = Employee::where('user_id', $userId)->firstOrFail();

        $salaryStructure = $employee->designation_id
            ? PayrollSalaryStructure::where('designation_id', $employee->designation_id)
            ->where('is_active', true)
            ->latest()
            ->first()
            : null;

        $salaryHeads = PayrollSalaryHead::where('is_active', true)
            ->whereIn('category', [SalaryHeadCategoryEnum::Gross->value, SalaryHeadCategoryEnum::Deduction->value])
            ->orderBy('position')
            ->orderBy('id')
            ->get();

        $activeProfile = $this->getActiveProfile($userId);

        return compact('employee', 'salaryStructure', 'salaryHeads', 'activeProfile');
    }
}
