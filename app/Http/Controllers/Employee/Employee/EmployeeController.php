<?php

namespace App\Http\Controllers\Employee\Employee;

use App\DataTables\Employee\Employee\EmployeesDataTable;
use App\Enums\Employee\EmployeeStatusEnum;
use App\Enums\Employee\EmployeeTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\Employee\UpdateEmployeeRequest;
use App\Services\Configuration\Department\DepartmentService;
use App\Services\Configuration\Designation\DesignationService;
use App\Services\Employee\Employee\EmployeeService;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function __construct(
        private EmployeeService $employeeService,
        private DepartmentService $departmentService,
        private DesignationService $designationService,
    ) {}

    public function index(EmployeesDataTable $dataTable)
    {
        return $dataTable->renderInertia('employee/employees/index', [
            'departments'     => $this->departmentService->all(['id', 'name']),
            'designations'    => $this->designationService->all(['id', 'name']),
            'managers'        => $this->employeeService->getEmployeeOptions(),
            'employeeTypes'   => EmployeeTypeEnum::options(),
            'employeeStatuses' => EmployeeStatusEnum::options(),
        ]);
    }

    public function create() {}

    public function store(StoreEmployeeRequest $request)
    {
        $this->employeeService->create($request->validated());

        return redirect()->back()->with('success', 'Employee created successfully.');
    }

    public function show(string $id)
    {
        $employee = $this->employeeService->find($id);
        $employee->load(['department', 'designation', 'manager', 'contacts', 'documents', 'education', 'experience']);

        return inertia('employee/employees/show', [
            'employee'         => $employee,
            'departments'      => $this->departmentService->all(['id', 'name']),
            'designations'     => $this->designationService->all(['id', 'name']),
            'managers'         => $this->employeeService->getEmployeeOptions(),
            'employeeTypes'    => EmployeeTypeEnum::options(),
            'employeeStatuses' => EmployeeStatusEnum::options(),
        ]);
    }

    public function edit(string $id) {}

    public function update(UpdateEmployeeRequest $request, string $id)
    {
        $this->employeeService->update($request->validated(), $id);

        return redirect()->back()->with('success', 'Employee updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->employeeService->delete($id);

        return redirect()->route('employee.employees.index')->with('success', 'Employee deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->employeeService->bulkDelete($ids);

        return response()->json(['message' => 'Employees deleted successfully.']);
    }
}
