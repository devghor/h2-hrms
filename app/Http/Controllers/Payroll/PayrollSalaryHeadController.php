<?php

namespace App\Http\Controllers\Payroll;

use App\DataTables\Payroll\PayrollSalaryHeadsDataTable;
use App\Enums\Payroll\SalaryHeadCategoryEnum;
use App\Enums\Payroll\SalaryHeadGlPrefixTypeEnum;
use App\Enums\Payroll\SalaryHeadIdentificationTypeEnum;
use App\Enums\Payroll\SalaryHeadModeEnum;
use App\Enums\Payroll\SalaryHeadTaxCalculationTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payroll\StorePayrollSalaryHeadRequest;
use App\Http\Requests\Payroll\UpdatePayrollSalaryHeadRequest;
use App\Services\Payroll\PayrollSalaryHeadService;
use Illuminate\Http\Request;

class PayrollSalaryHeadController extends Controller
{
    public function __construct(private PayrollSalaryHeadService $payrollSalaryHeadService) {}

    public function index(PayrollSalaryHeadsDataTable $dataTable)
    {
        return $dataTable->renderInertia('payroll/salary-heads/index', [
            'modes'               => SalaryHeadModeEnum::options(),
            'glPrefixTypes'       => SalaryHeadGlPrefixTypeEnum::options(),
            'identificationTypes' => SalaryHeadIdentificationTypeEnum::options(),
            'categories'          => SalaryHeadCategoryEnum::options(),
            'taxCalculationTypes' => SalaryHeadTaxCalculationTypeEnum::options(),
        ]);
    }

    public function store(StorePayrollSalaryHeadRequest $request)
    {
        $this->payrollSalaryHeadService->create($request->validated());

        return redirect()->back()->with('success', 'Salary head created successfully.');
    }

    public function update(UpdatePayrollSalaryHeadRequest $request, string $id)
    {
        $this->payrollSalaryHeadService->update($request->validated(), $id);

        return redirect()->back()->with('success', 'Salary head updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->payrollSalaryHeadService->delete($id);

        return redirect()->route('payroll.salary-heads.index')->with('success', 'Salary head deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->payrollSalaryHeadService->bulkDelete($ids);

        return response()->json(['message' => 'Salary heads deleted successfully.']);
    }
}
