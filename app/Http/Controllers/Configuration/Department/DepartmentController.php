<?php

namespace App\Http\Controllers\Configuration\Department;

use App\DataTables\Configuration\Department\DepartmentsDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Department\StoreDepartmentRequest;
use App\Http\Requests\Configuration\Department\UpdateDepartmentRequest;
use App\Repositories\Configuration\Department\DepartmentRepository;
use App\Repositories\Configuration\Division\DivisionRepository;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function __construct(private DepartmentRepository $departmentRepository, private DivisionRepository $divisionRepository) {}

    public function index(DepartmentsDataTable $dataTable)
    {
        return $dataTable->renderInertia('configuration/departments/index', [
            'divisions' => $this->divisionRepository->getdivisionOptions(),
        ]);
    }

    public function create() {}

    public function store(StoreDepartmentRequest $request)
    {
        $input = $request->validated();
        $this->departmentRepository->create($input);
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
        $input  = $request->validated();
        $this->departmentRepository->update($input, $id);
        return redirect()->route('configuration.departments.index')->with([
            'success' => __('Department updated successfully.'),
        ]);
    }

    public function destroy(string $id)
    {
        $this->departmentRepository->delete($id);
        return redirect()->route('configuration.departments.index')->with([
            'success' => __('Department deleted successfully.'),
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->departmentRepository->bulkDelete($ids);

        return response()->json(['message' => 'Departments deleted successfully.']);
    }
}
