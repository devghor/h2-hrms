<?php

namespace App\Http\Controllers\Uam\Permission;

use App\DataTables\Uam\Permission\PermissionsDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Uam\Permission\StorePermissionRequest;
use App\Http\Requests\Uam\Permission\UpdatePermissionRequest;
use App\Http\Resources\Uam\Permission\PermissionResource;
use App\Models\Uam\Permission;
use App\Services\Uam\Permission\PermissionService;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function __construct(private PermissionService $permissionService) {}

    public function index(PermissionsDataTable $dataTable)
    {
        return $dataTable->renderInertia('uam/permissions/index');
    }

    public function store(StorePermissionRequest $request)
    {
        $permission = $this->permissionService->create($request->validated());
        return inertia('uam/permissions/index', [
            'permission' => new PermissionResource($permission),
            'success' => 'Permission created successfully.',
        ]);
    }

    public function update(UpdatePermissionRequest $request, Permission $permission)
    {
        $this->permissionService->update($request->validated(), $permission->id);
        return redirect()->route('uam.permissions.index')->with([
            'success' => 'Permission updated successfully.',
        ]);
    }

    public function destroy(Permission $permission)
    {
        $this->permissionService->delete($permission->id);
        return redirect()->route('uam.permissions.index')->with([
            'success' => 'Permission deleted successfully.',
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->permissionService->bulkDelete($ids);

        return response()->json(['message' => 'Permissions deleted successfully.']);
    }
}
