<?php

namespace App\Http\Controllers\Api\V1\Uam;

use App\Exports\RolesExport;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Uam\RoleCollection;
use App\Http\Resources\Uam\RoleResource;
use App\Models\Uam\Role;
use App\Services\Uam\PermissionService;
use App\Services\Uam\RoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class RoleController extends Controller
{
    public function __construct(
        protected PermissionService $permissionService, protected RoleService $roleService
    ) {}

    /**
     * Display a listing of roles
     */
    public function index(Request $request): JsonResponse|RoleCollection
    {
        // $this->authorize('viewAny', Role::class);

        $roles = $this->roleService->getAllRoles($request);

        return new RoleCollection($roles);
    }

    /**
     * Store a newly created role
     */
    public function store(Request $request): JsonResponse|RoleResource
    {
        // $this->authorize('create', Role::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'description' => 'nullable|string|max:500',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role = $this->permissionService->createRole(
            $validated,
            $validated['permissions'] ?? []
        );

        return new RoleResource($role);
    }

    /**
     * Display the specified role
     */
    public function show(Role $role)
    {
        // $this->authorize('view', $role);

        return new RoleResource($role);
    }

    /**
     * Update the specified role
     */
    public function update(Request $request, Role $role): JsonResponse|RoleResource
    {
        // $this->authorize('update', $role);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:roles,name,' . $role->id,
            'description' => 'nullable|string|max:500',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        if (isset($validated['name'])) {
            $role->name = $validated['name'];
        }

        if (isset($validated['description'])) {
            $role->description = $validated['description'];
        }

        $role->save();

        if (isset($validated['permissions'])) {
            $this->permissionService->assignPermissionsToRole($role, $validated['permissions']);
        }

        return new RoleResource($role);
    }

    /**
     * Remove the specified role
     */
    public function destroy(Role $role): JsonResponse
    {
        // $this->authorize('delete', $role);

        // Prevent deletion of system roles
        if (in_array($role->name, ['Super Admin', 'Admin'])) {
            return ApiResponse::error('Cannot delete system role', [], 403);
        }

        $role->delete();

        return ApiResponse::noContent();
    }

    public function bulkDestroy(Request $request): JsonResponse
    {
        // $this->authorize('delete', Role::class);

        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:roles,id',
        ]);

        // Prevent deletion of system roles
        $systemRoles = Role::whereIn('id', $validated['ids'])
            ->whereIn('name', ['Super Admin', 'Admin'])
            ->exists();

        if ($systemRoles) {
            return ApiResponse::error('Cannot delete system roles', [], 403);
        }

        $deletedCount = $this->roleService->bulkDeleteRoles($validated['ids']);

        return ApiResponse::success(
            "{$deletedCount} role(s) deleted successfully",
            [
                'deleted_count' => $deletedCount,
            ]
        );
    }

    /**
     * Assign permissions to role
     */
    public function assignPermissions(Request $request, Role $role): JsonResponse
    {
        $this->authorize('update', $role);

        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $this->permissionService->assignPermissionsToRole($role, $validated['permissions']);

        return ApiResponse::success('Permissions assigned successfully', [
            'role' => $role->fresh()->load('permissions'),
        ]);
    }

    /**
     * Export roles to Excel
     */
    public function export(Request $request)
    {
        // $this->authorize('viewAny', Role::class);

        $filters = $request->only(['search']);

        $fileName = 'roles_' . now()->format('Y-m-d_His') . '.xlsx';

        return Excel::download(new RolesExport($filters), $fileName);
    }
}
