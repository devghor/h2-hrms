<?php

namespace App\Http\Controllers\Configuration\Division;

use App\DataTables\Configuration\Division\DivisionsDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Division\StoreDivisionRequest;
use App\Http\Requests\Configuration\Division\UpdateDivisionRequest;
use App\Repositories\Configuration\Division\DivisionRepository;
use Illuminate\Http\Request;

class DivisionController extends Controller
{
    public function __construct(private DivisionRepository $divisionRepository) {}

    public function index(DivisionsDataTable $dataTable)
    {
        return $dataTable->renderInertia('configuration/divisions/index');
    }

    public function create() {}

    public function store(StoreDivisionRequest $request)
    {
        $input = $request->validated();
        $this->divisionRepository->create($input);
        return redirect()->back()->with('success', 'Division created successfully.');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(UpdateDivisionRequest $request, string $id)
    {
        $input  = $request->validated();
        $this->divisionRepository->update($input, $id);
        return redirect()->route('configuration.divisions.index')->with([
            'success' => __('Division updated successfully.'),
        ]);
    }

    public function destroy(string $id)
    {
        $this->divisionRepository->delete($id);
        return redirect()->route('configuration.divisions.index')->with([
            'success' => __('Division deleted successfully.'),
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->divisionRepository->bulkDelete($ids);

        return response()->json(['message' => 'Divisions deleted successfully.']);
    }
}
