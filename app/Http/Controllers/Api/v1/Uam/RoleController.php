<?php

namespace App\Http\Controllers\Api\v1\Uam;

use App\Http\Controllers\Api\v1\Core\CoreController;
use App\Http\Resources\v1\Uam\RoleResource;
use App\Services\v1\Uam\RoleService;
use Illuminate\Http\Request;

/**
 * @tags Uam
 */
final class RoleController extends CoreController
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * Roles List
     */
    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $roles = $this->roleService->getAllRoles();
        return RoleResource::collection($roles);
    }

    /**
     * Roles Create
     */
    public function store(Request $request): RoleResource
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'guard_name' => 'required|string|max:255',
        ]);
        $role = $this->roleService->createRole($validated);
        return new RoleResource($role);
    }

    /**
     * Roles Read
     */
    public function show(int $id): RoleResource
    {
        $role = $this->roleService->getRole($id);
        return new RoleResource($role);
    }

    /**
     * Roles Update
     */
    public function update(Request $request, int $id): RoleResource
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'guard_name' => 'sometimes|required|string|max:255',
        ]);
        $role = $this->roleService->updateRole($id, $validated);
        return new RoleResource($role);
    }

    /**
     * Roles Delete
     */
    public function destroy(int $id): \Illuminate\Http\JsonResponse
    {
        $this->roleService->deleteRole($id);
        return response()->json(['message' => 'Role deleted successfully']);
    }
}
