<?php

namespace App\Http\Controllers\Payroll;

use App\DataTables\Payroll\PayrollSalaryStructuresDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Payroll\StorePayrollSalaryStructureRequest;
use App\Http\Requests\Payroll\UpdatePayrollSalaryStructureRequest;
use App\Services\Configuration\Designation\DesignationService;
use App\Services\Payroll\PayrollSalaryStructureService;
use Illuminate\Http\Request;

class PayrollSalaryStructureController extends Controller
{
    public function __construct(
        private PayrollSalaryStructureService $payrollSalaryStructureService,
        private DesignationService $designationService,
    ) {}

    public function index(PayrollSalaryStructuresDataTable $dataTable)
    {
        return $dataTable->renderInertia('payroll/salary-structures/index', [
            'designations' => $this->designationService->getDesignationOptions(),
        ]);
    }

    public function show(string $id)
    {
        return response()->json(
            $this->payrollSalaryStructureService->find($id)->load('designation')
        );
    }

    public function store(StorePayrollSalaryStructureRequest $request)
    {
        $this->payrollSalaryStructureService->create($request->validated());

        return redirect()->back()->with('success', 'Salary structure created successfully.');
    }

    public function update(UpdatePayrollSalaryStructureRequest $request, string $id)
    {
        $this->payrollSalaryStructureService->update($request->validated(), $id);

        return redirect()->back()->with('success', 'Salary structure updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->payrollSalaryStructureService->delete($id);

        return redirect()->route('payroll.salary-structures.index')->with('success', 'Salary structure deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->payrollSalaryStructureService->bulkDelete($ids);

        return response()->json(['message' => 'Salary structures deleted successfully.']);
    }
}
