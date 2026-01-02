<?php

namespace App\Http\Controllers\Api\V1\Uam;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Uam\Role;
use App\Services\Uam\PermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct(
        protected PermissionService $permissionService
    ) {}

    /**
     * Display a listing of roles
     */
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Role::class);

        $roles = Role::with('permissions')->get();

        return ApiResponse::success('Roles retrieved successfully', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created role
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Role::class);

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

        return ApiResponse::created('Role created successfully', [
            'role' => $role->load('permissions'),
        ]);
    }

    /**
     * Display the specified role
     */
    public function show(Role $role): JsonResponse
    {
        $this->authorize('view', $role);

        return ApiResponse::success('Role retrieved successfully', [
            'role' => $role->load('permissions'),
        ]);
    }

    /**
     * Update the specified role
     */
    public function update(Request $request, Role $role): JsonResponse
    {
        $this->authorize('update', $role);

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

        return ApiResponse::success('Role updated successfully', [
            'role' => $role->fresh()->load('permissions'),
        ]);
    }

    /**
     * Remove the specified role
     */
    public function destroy(Role $role): JsonResponse
    {
        $this->authorize('delete', $role);

        // Prevent deletion of system roles
        if (in_array($role->name, ['Super Admin', 'Admin'])) {
            return ApiResponse::error('Cannot delete system role', [], 403);
        }

        $role->delete();

        return ApiResponse::noContent();
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
}
