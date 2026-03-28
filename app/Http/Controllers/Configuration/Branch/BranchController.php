<?php

namespace App\Http\Controllers\Configuration\Branch;

use App\DataTables\Configuration\Branch\BranchesDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Branch\StoreBranchRequest;
use App\Http\Requests\Configuration\Branch\UpdateBranchRequest;
use App\Repositories\Configuration\Branch\BranchRepository;
use App\Repositories\Configuration\Company\CompanyRepository;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function __construct(
        private BranchRepository $branchRepository,
        private CompanyRepository $companyRepository,
    ) {}

    public function index(BranchesDataTable $dataTable)
    {
        return $dataTable->renderInertia('configuration/branches/index', [
            'companies' => $this->companyRepository->getCompanyOptions(),
        ]);
    }

    public function create() {}

    public function store(StoreBranchRequest $request)
    {
        $this->branchRepository->create($request->validated());
        return redirect()->back()->with('success', 'Branch created successfully.');
    }

    public function show(string $id) {}

    public function edit(string $id) {}

    public function update(UpdateBranchRequest $request, string $id)
    {
        $this->branchRepository->update($request->validated(), $id);
        return redirect()->route('configuration.branches.index')->with([
            'success' => __('Branch updated successfully.'),
        ]);
    }

    public function destroy(string $id)
    {
        $this->branchRepository->delete($id);
        return redirect()->route('configuration.branches.index')->with([
            'success' => __('Branch deleted successfully.'),
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->branchRepository->bulkDelete($ids);

        return response()->json(['message' => 'Branches deleted successfully.']);
    }
}
