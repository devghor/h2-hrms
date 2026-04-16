<?php

namespace App\Http\Controllers\Payroll;

use App\DataTables\Payroll\PayrollEmployeeSalaryProfilesDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payroll\StorePayrollEmployeeSalaryProfileRequest;
use App\Services\Payroll\PayrollEmployeeSalaryProfileService;
use Inertia\Inertia;

class PayrollEmployeeSalaryProfileController extends Controller
{
    public function __construct(
        private PayrollEmployeeSalaryProfileService $service,
    ) {}

    public function index(PayrollEmployeeSalaryProfilesDataTable $dataTable)
    {
        return $dataTable->renderInertia('payroll/employee-salary-profiles/index');
    }

    public function show(string $userId)
    {
        $data = $this->service->getSalaryDataForEmployee((int) $userId);

        return Inertia::render('payroll/employee-salary-profiles/show', [
            'employee'        => $data['employee'],
            'salaryHeads'     => $data['salaryHeads'],
            'activeProfile'   => $data['activeProfile'],
            'salaryStructure' => $data['salaryStructure'],
        ]);
    }

    public function store(StorePayrollEmployeeSalaryProfileRequest $request)
    {
        $validated = $request->validated();

        $this->service->createProfile(
            userId: (int) $validated['user_id'],
            items: $validated['items'],
            basicAmount: (float) $validated['basic_amount'],
            grossAmount: (float) $validated['gross_amount'],
            deductionAmount: (float) $validated['deduction_amount'],
            netAmount: (float) $validated['net_amount'],
        );

        return redirect()
            ->route('payroll.employee-salary-profiles.show', $validated['user_id'])
            ->with('success', 'Salary profile saved successfully.');
    }
}
