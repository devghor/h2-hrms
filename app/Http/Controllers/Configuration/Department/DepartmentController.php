<?php

namespace App\Http\Controllers\Configuration\Department;

use App\DataTables\Configuration\Department\DepartmentsDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Department\StoreDepartmentRequest;
use App\Http\Requests\Configuration\Department\UpdateDepartmentRequest;
use App\Services\Configuration\Department\DepartmentService;
use App\Services\Configuration\Division\DivisionService;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function __construct(private DepartmentService $departmentService, private DivisionService $divisionService) {}

    public function index(DepartmentsDataTable $dataTable)
    {
        return $dataTable->renderInertia('configuration/departments/index', [
            'divisions' => $this->divisionService->getDivisionOptions(),
        ]);
    }

    public function create() {}

    public function store(StoreDepartmentRequest $request)
    {
        $this->departmentService->create($request->validated());
        return redirect()->back()->with('success', 'Department created successfully.');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(UpdateDepartmentRequest $request, string $id)
    {
        $this->departmentService->update($request->validated(), $id);
        return redirect()->route('configuration.departments.index')->with([
            'success' => __('Department updated successfully.'),
        ]);
    }

    public function destroy(string $id)
    {
        $this->departmentService->delete($id);
        return redirect()->route('configuration.departments.index')->with([
            'success' => __('Department deleted successfully.'),
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->departmentService->bulkDelete($ids);

        return response()->json(['message' => 'Departments deleted successfully.']);
    }
}
