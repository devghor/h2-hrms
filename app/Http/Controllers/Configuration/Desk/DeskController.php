<?php

namespace App\Http\Controllers\Configuration\Desk;

use App\DataTables\Configuration\Desk\DesksDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Desk\StoreDeskRequest;
use App\Http\Requests\Configuration\Desk\UpdateDeskRequest;
use App\Repositories\Configuration\Desk\DeskRepository;
use Illuminate\Http\Request;

class DeskController extends Controller
{
    public function __construct(private DeskRepository $deskRepository) {}

    public function index(DesksDataTable $dataTable)
    {
        return $dataTable->renderInertia('configuration/desks/index');
    }

    public function create() {}

    public function store(StoreDeskRequest $request)
    {
        $input = $request->validated();
        $this->deskRepository->create($input);
        return redirect()->back()->with('success', 'Desk created successfully.');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(UpdateDeskRequest $request, string $id)
    {
        $input  = $request->validated();
        $this->deskRepository->update($input, $id);
        return redirect()->route('configuration.desks.index')->with([
            'success' => __('Desk updated successfully.'),
        ]);
    }

    public function destroy(string $id)
    {
        $this->deskRepository->delete($id);
        return redirect()->route('configuration.desks.index')->with([
            'success' => __('Desk deleted successfully.'),
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->deskRepository->bulkDelete($ids);

        return response()->json(['message' => 'Desks deleted successfully.']);
    }
}
