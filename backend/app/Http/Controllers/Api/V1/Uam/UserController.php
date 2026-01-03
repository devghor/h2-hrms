<?php

namespace App\Http\Controllers\Api\V1\Uam;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Uam\UserCollection;
use App\Http\Resources\Uam\UserResource;
use App\Models\Uam\User;
use App\Services\Uam\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    public function index(Request $request): JsonResponse|UserCollection
    {
        $users = $this->userService->getAllUsers($request);

        return new UserCollection($users);
    }

    public function store(Request $request)
    {
        // $this->authorize('create', User::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $this->userService->createUser($validated);

        return new UserResource($user);

    }

    public function show(User $user)
    {
        // $this->authorize('view', $user);

        return new UserResource($user);
    }

    public function update(Request $request, User $user)
    {
        // $this->authorize('update', $user);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|string|min:8|confirmed',
        ]);

        $user = $this->userService->updateUser($user, $validated);

        return new UserResource($user);
    }

    public function destroy(User $user)
    {
        // $this->authorize('delete', $user);

        $this->userService->deleteUser($user);

        return ApiResponse::noContent();
    }

    public function bulkDestroy(Request $request)
    {
        // $this->authorize('delete', User::class);

        $validated = $request->validate([
            'ulids' => 'required|array|min:1',
            'ulids.*' => 'required|string|exists:users,ulid',
        ]);

        $deletedCount = $this->userService->bulkDeleteUsers($validated['ulids']);

        return ApiResponse::success(
            "{$deletedCount} user(s) deleted successfully",
            [
                'deleted_count' => $deletedCount,
            ]
        );
    }
}
