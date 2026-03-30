<?php

namespace App\Http\Controllers\Configuration\Unit;

use App\DataTables\Configuration\Unit\UnitsDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Unit\StoreUnitRequest;
use App\Http\Requests\Configuration\Unit\UpdateUnitRequest;
use App\Services\Configuration\Department\DepartmentService;
use App\Services\Configuration\Unit\UnitService;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function __construct(private UnitService $unitService, private DepartmentService $departmentService) {}

    public function index(UnitsDataTable $dataTable)
    {
        return $dataTable->renderInertia('configuration/units/index', [
            'departments' => $this->departmentService->getDepartmentOptions(),
        ]);
    }

    public function create() {}

    public function store(StoreUnitRequest $request)
    {
        $this->unitService->create($request->validated());
        return redirect()->back()->with('success', 'Unit created successfully.');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(UpdateUnitRequest $request, string $id)
    {
        $this->unitService->update($request->validated(), $id);
        return redirect()->route('configuration.units.index')->with([
            'success' => __('Unit updated successfully.'),
        ]);
    }

    public function destroy(string $id)
    {
        $this->unitService->delete($id);
        return redirect()->route('configuration.units.index')->with([
            'success' => __('Unit deleted successfully.'),
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->unitService->bulkDelete($ids);

        return response()->json(['message' => 'Units deleted successfully.']);
    }
}
