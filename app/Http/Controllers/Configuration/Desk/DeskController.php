<?php

namespace App\Http\Controllers\Configuration\Desk;

use App\DataTables\Configuration\Desk\DesksDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Desk\StoreDeskRequest;
use App\Http\Requests\Configuration\Desk\UpdateDeskRequest;
use App\Services\Configuration\Desk\DeskService;
use Illuminate\Http\Request;

class DeskController extends Controller
{
    public function __construct(private DeskService $deskService) {}

    public function index(DesksDataTable $dataTable)
    {
        return $dataTable->renderInertia('configuration/desks/index');
    }

    public function create() {}

    public function store(StoreDeskRequest $request)
    {
        $this->deskService->create($request->validated());
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
        $this->deskService->update($request->validated(), $id);
        return redirect()->route('configuration.desks.index')->with([
            'success' => __('Desk updated successfully.'),
        ]);
    }

    public function destroy(string $id)
    {
        $this->deskService->delete($id);
        return redirect()->route('configuration.desks.index')->with([
            'success' => __('Desk deleted successfully.'),
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->deskService->bulkDelete($ids);

        return response()->json(['message' => 'Desks deleted successfully.']);
    }
}
