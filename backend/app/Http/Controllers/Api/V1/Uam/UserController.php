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

    public function store(Request $request): JsosnResponse
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $this->userService->createUser($validated);

        return ApiResponse::created('User created successfully', [
            'user' => new UserResource($user),
        ]);
    }

    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        return ApiResponse::success('User retrieved successfully', [
            'user' => new UserResource($user),
        ]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|string|min:8|confirmed',
        ]);

        $user = $this->userService->updateUser($user, $validated);

        return ApiResponse::success('User updated successfully', [
            'user' => new UserResource($user),
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        $this->userService->deleteUser($user);

        return ApiResponse::noContent();
    }
}
