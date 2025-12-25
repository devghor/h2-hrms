<?php

namespace App\Http\Controllers\Configuration\Division;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Division\StoreDivisionRequest;
use App\Http\Requests\Configuration\Division\UpdateDivisionRequest;
use App\Models\Configuration\Division\Division;
use App\Repositories\Configuration\Division\DivisionRepository;
use Yajra\DataTables\Facades\DataTables;

class DivisionController extends Controller
{
    public function __construct(private DivisionRepository $divisionRepository) {}

    public function index()
    {
        if (request()->query('data-table')) {
            return DataTables::eloquent(Division::query())
                ->editColumn('created_at', function ($division) {
                    return $division->created_at->format('Y-m-d H:i:s');
                })
                ->editColumn('updated_at', function ($division) {
                    return $division->updated_at->format('Y-m-d H:i:s');
                })
                ->rawColumns(['action'])
                ->make(true);
        }
        return inertia('configuration/divisions/index');
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
}
