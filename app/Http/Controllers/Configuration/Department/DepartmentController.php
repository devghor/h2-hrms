<?php

namespace App\Http\Controllers\Configuration\Department;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Department\StoreDepartmentRequest;
use App\Http\Requests\Configuration\Department\UpdateDepartmentRequest;
use App\Models\Configuration\Department\Department;
use App\Repositories\Configuration\Department\DepartmentRepository;
use Yajra\DataTables\Facades\DataTables;

class DepartmentController extends Controller
{
    public function __construct(private DepartmentRepository $departmentRepository) {}

    public function index()
    {
        if (request()->query('data-table')) {
            return DataTables::eloquent(Department::query())
                ->editColumn('created_at', function ($department) {
                    return $department->created_at->format('Y-m-d H:i:s');
                })
                ->editColumn('updated_at', function ($department) {
                    return $department->updated_at->format('Y-m-d H:i:s');
                })
                ->rawColumns(['action'])
                ->make(true);
        }
        return inertia('configuration/departments/index');
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
}
