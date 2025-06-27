<?php

namespace App\Http\Controllers\Api\v1\Uam;

use App\Http\Controllers\Api\v1\Core\CoreController;
use App\Http\Resources\v1\Uam\RoleResource;
use App\Services\v1\Uam\RoleService;
use Illuminate\Http\Request;

/**
 * @group UAM
 *
 * APIs for managing roles.
 */
class RoleController extends CoreController
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * List all roles.
     *
     * @apiResourceCollection App\Http\Resources\v1\Uam\RoleResource
     * @authenticated
     */
    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $roles = $this->roleService->getAllRoles();
        return RoleResource::collection($roles);
    }

    /**
     * Create a new role.
     *
     * @apiResource App\Http\Resources\v1\Uam\RoleResource
     * @bodyParam name string required The name of the role. Example: admin
     * @bodyParam guard_name string required The guard name. Example: web
     * @authenticated
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
     * Show a role.
     *
     * @apiResource App\Http\Resources\v1\Uam\RoleResource
     * @urlParam id int required The ID of the role. Example: 1
     * @authenticated
     */
    public function show(int $id): RoleResource
    {
        $role = $this->roleService->getRole($id);
        return new RoleResource($role);
    }

    /**
     * Update a role.
     *
     * @apiResource App\Http\Resources\v1\Uam\RoleResource
     * @urlParam id int required The ID of the role. Example: 1
     * @bodyParam name string The name of the role. Example: editor
     * @bodyParam guard_name string The guard name. Example: web
     * @authenticated
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
     * Delete a role.
     *
     * @urlParam id int required The ID of the role. Example: 1
     * @response 200 scenario=deleted {"message": "Role deleted successfully"}
     * @response 404 scenario=not_found {"message": "Role not found"}
     * @authenticated
     */
    public function destroy(int $id): \Illuminate\Http\JsonResponse
    {
        $this->roleService->deleteRole($id);
        return response()->json(['message' => 'Role deleted successfully']);
    }
}
