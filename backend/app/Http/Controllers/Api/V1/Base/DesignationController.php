<?php

namespace App\Http\Controllers\Api\V1\Base;

use App\Exports\DesignationsExport;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Base\StoreDesignationRequest;
use App\Http\Requests\Base\UpdateDesignationRequest;
use App\Http\Resources\Base\DesignationResource;
use App\Models\Base\Designation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Maatwebsite\Excel\Facades\Excel;

class DesignationController extends Controller
{
    /**
     * Instantiate a new controller instance.
     */
    public function __construct()
    {
        $this->authorizeResource(Designation::class, 'designation');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse|AnonymousResourceCollection
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $level = $request->input('level');

        $query = Designation::query();

        // Search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Level filter
        if ($level) {
            $query->where('level', $level);
        }

        // Sort by level and name
        $query->orderBy('level', 'asc')
            ->orderBy('name', 'asc');

        $designations = $query->paginate($perPage);

        return DesignationResource::collection($designations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDesignationRequest $request): JsonResponse
    {
        $designation = Designation::create($request->validated());

        return ApiResponse::created(
            'Designation created successfully.',
            (new DesignationResource($designation))->toArray($request)
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Designation $designation): JsonResponse
    {
        return ApiResponse::success(
            'Designation retrieved successfully.',
            (new DesignationResource($designation))->toArray(request())
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDesignationRequest $request, Designation $designation): JsonResponse
    {
        $designation->update($request->validated());

        return ApiResponse::success(
            'Designation updated successfully.',
            (new DesignationResource($designation))->toArray($request)
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Designation $designation): JsonResponse
    {
        $designation->delete();

        return ApiResponse::success(
            'Designation deleted successfully.',
            []
        );
    }

    /**
     * Restore the specified soft deleted resource.
     */
    public function restore(string $ulid): JsonResponse
    {
        $designation = Designation::withTrashed()->where('ulid', $ulid)->firstOrFail();

        $this->authorize('restore', $designation);

        $designation->restore();

        return ApiResponse::success(
            'Designation restored successfully.',
            (new DesignationResource($designation))->toArray(request())
        );
    }

    /**
     * Get all designations without pagination.
     */
    public function all(): JsonResponse
    {
        $this->authorize('viewAny', Designation::class);

        $designations = Designation::orderBy('level', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return ApiResponse::success(
            'All designations retrieved successfully.',
            DesignationResource::collection($designations)->toArray(request())
        );
    }

    /**
     * Export designations to Excel.
     */
    public function export(Request $request)
    {
        $this->authorize('viewAny', Designation::class);

        $filters = $request->only(['search', 'level', 'include_deleted']);

        $fileName = 'designations_' . now()->format('Y-m-d_His') . '.xlsx';

        return Excel::download(new DesignationsExport($filters), $fileName);
    }
}
