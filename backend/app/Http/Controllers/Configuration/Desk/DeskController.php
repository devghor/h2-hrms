<?php

namespace App\Http\Controllers\Configuration\Desk;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Desk\StoreDeskRequest;
use App\Http\Requests\Configuration\Desk\UpdateDeskRequest;
use App\Models\Configuration\Desk\Desk;
use App\Repositories\Configuration\Desk\DeskRepository;
use Yajra\DataTables\Facades\DataTables;

class DeskController extends Controller
{
    public function __construct(private DeskRepository $deskRepository) {}

    public function index()
    {
        if (request()->query('data-table')) {
            return DataTables::eloquent(Desk::query())
                ->editColumn('created_at', function ($desk) {
                    return $desk->created_at->format('Y-m-d H:i:s');
                })
                ->editColumn('updated_at', function ($desk) {
                    return $desk->updated_at->format('Y-m-d H:i:s');
                })
                ->rawColumns(['action'])
                ->make(true);
        }
        return inertia('configuration/desks/index');
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
}
