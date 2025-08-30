<?php

namespace App\Http\Controllers\Uam\Permission;

use App\DataTables\Uam\Permission\PermissionsDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Uam\Permission\StorePermissionRequest;
use App\Http\Requests\Uam\Permission\UpdatePermissionRequest;
use App\Http\Resources\Uam\PermissionResource;
use App\Models\Uam\Permission;
use App\Repositories\Uam\Permission\PermissionRepository;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function __construct(private PermissionRepository $permissionRepository) {}

    public function index(PermissionsDataTable $dataTable)
    {
        if (request()->query('permissions-data-table')) {
            return $dataTable->ajax();
        }
        return inertia('uam/permissions/index');
    }

    public function store(StorePermissionRequest $request)
    {
        $permission = $this->permissionRepository->create($request->validated());
        return inertia('uam/permissions/index', [
            'permission' => new PermissionResource($permission),
            'success' => 'Permission created successfully.',
        ]);
    }

    public function update(UpdatePermissionRequest $request, Permission $permission)
    {
        $this->permissionRepository->update($request->validated(), $permission->id);
        return redirect()->route('uam.permissions.index')->with([
            'success' => 'Permission updated successfully.',
        ]);
    }

    public function destroy(Permission $permission)
    {
        $this->permissionRepository->delete($permission->id);
        return redirect()->route('uam.permissions.index')->with([
            'success' => 'Permission deleted successfully.',
        ]);
    }
}
