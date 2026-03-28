<?php

namespace App\Http\Controllers\Configuration\Branch;

use App\DataTables\Configuration\Branch\BranchesDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Branch\StoreBranchRequest;
use App\Http\Requests\Configuration\Branch\UpdateBranchRequest;
use App\Services\Configuration\Branch\BranchService;
use App\Services\Configuration\Company\CompanyService;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function __construct(
        private BranchService $branchService,
        private CompanyService $companyService,
    ) {}

    public function index(BranchesDataTable $dataTable)
    {
        return $dataTable->renderInertia('configuration/branches/index', [
            'companies' => $this->companyService->getCompanyOptions(),
        ]);
    }

    public function create() {}

    public function store(StoreBranchRequest $request)
    {
        $this->branchService->create($request->validated());
        return redirect()->back()->with('success', 'Branch created successfully.');
    }

    public function show(string $id) {}

    public function edit(string $id) {}

    public function update(UpdateBranchRequest $request, string $id)
    {
        $this->branchService->update($request->validated(), $id);
        return redirect()->route('configuration.branches.index')->with([
            'success' => __('Branch updated successfully.'),
        ]);
    }

    public function destroy(string $id)
    {
        $this->branchService->delete($id);
        return redirect()->route('configuration.branches.index')->with([
            'success' => __('Branch deleted successfully.'),
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->branchService->bulkDelete($ids);

        return response()->json(['message' => 'Branches deleted successfully.']);
    }
}
