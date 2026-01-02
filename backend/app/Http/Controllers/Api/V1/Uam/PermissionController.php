<?php

namespace App\Http\Controllers\Api\V1\Uam;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Uam\Permission;
use App\Services\Uam\PermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function __construct(
        protected PermissionService $permissionService
    ) {}

    /**
     * Display a listing of permissions
     */
    public function index(): JsonResponse
    {
        $permissions = Permission::all()->groupBy('module');

        return ApiResponse::success('Permissions retrieved successfully', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Get permissions grouped by module and group
     */
    public function grouped(): JsonResponse
    {
        $permissions = $this->permissionService->getPermissionsGroupedByModule();

        return ApiResponse::success('Grouped permissions retrieved successfully', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Get user's permissions
     */
    public function userPermissions(Request $request): JsonResponse
    {
        $user = $request->user();
        $permissions = $this->permissionService->getUserPermissions($user);

        return ApiResponse::success('User permissions retrieved successfully', $permissions);
    }
}
