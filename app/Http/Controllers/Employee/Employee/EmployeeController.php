<?php

namespace App\Http\Controllers\Employee\Employee;

use App\DataTables\Employee\Employee\EmployeesDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\Employee\UpdateEmployeeRequest;
use App\Repositories\Configuration\Department\DepartmentRepository;
use App\Repositories\Configuration\Desk\DeskRepository;
use App\Repositories\Employee\Employee\EmployeeRepository;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function __construct(
        private EmployeeRepository $employeeRepository,
        private DepartmentRepository $departmentRepository,
        private DeskRepository $deskRepository,
    ) {}

    public function index(EmployeesDataTable $dataTable)
    {
        return $dataTable->renderInertia('employee/employees/index', [
            'departments'  => $this->departmentRepository->all(['id', 'name']),
            'designations' => $this->deskRepository->all(['id', 'name']),
            'managers'     => $this->employeeRepository->getEmployeeOptions(),
        ]);
    }

    public function create() {}

    public function store(StoreEmployeeRequest $request)
    {
        $this->employeeRepository->create($request->validated());

        return redirect()->back()->with('success', 'Employee created successfully.');
    }

    public function show(string $id)
    {
        $employee = $this->employeeRepository->find($id);
        $employee->load(['department', 'designation', 'manager', 'contacts', 'documents', 'education', 'experience']);

        return inertia('employee/employees/show', [
            'employee'     => $employee,
            'departments'  => $this->departmentRepository->all(['id', 'name']),
            'designations' => $this->deskRepository->all(['id', 'name']),
            'managers'     => $this->employeeRepository->getEmployeeOptions(),
        ]);
    }

    public function edit(string $id) {}

    public function update(UpdateEmployeeRequest $request, string $id)
    {
        $this->employeeRepository->update($request->validated(), $id);

        return redirect()->back()->with('success', 'Employee updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->employeeRepository->delete($id);

        return redirect()->route('employee.employees.index')->with('success', 'Employee deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->employeeRepository->bulkDelete($ids);

        return response()->json(['message' => 'Employees deleted successfully.']);
    }
}
