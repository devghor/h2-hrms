<?php

namespace App\Http\Controllers\Configuration\Designation;

use App\DataTables\Configuration\Designation\DesignationsDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Designation\StoreDesignationRequest;
use App\Http\Requests\Configuration\Designation\UpdateDesignationRequest;
use App\Services\Configuration\Designation\DesignationService;
use Illuminate\Http\Request;

class DesignationController extends Controller
{
    public function __construct(private DesignationService $designationService) {}

    public function index(DesignationsDataTable $dataTable)
    {
        return $dataTable->renderInertia('configuration/designations/index');
    }

    public function create() {}

    public function store(StoreDesignationRequest $request)
    {
        $this->designationService->create($request->validated());
        return redirect()->back()->with('success', 'Designation created successfully.');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(UpdateDesignationRequest $request, string $id)
    {
        $this->designationService->update($request->validated(), $id);
        return redirect()->route('configuration.designations.index')->with([
            'success' => __('Designation updated successfully.'),
        ]);
    }

    public function destroy(string $id)
    {
        $this->designationService->delete($id);
        return redirect()->route('configuration.designations.index')->with([
            'success' => __('Designation deleted successfully.'),
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->designationService->bulkDelete($ids);

        return response()->json(['message' => 'Designations deleted successfully.']);
    }
}
