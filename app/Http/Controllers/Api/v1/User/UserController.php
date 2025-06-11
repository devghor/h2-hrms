<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Api\v1\Core\CoreController;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\v1\User\UserResource;
use App\Services\User\UserService;
use Dedoc\Scramble\Attributes\QueryParameter;

final class UserController extends CoreController
{
    public function __construct(private UserService $userService) {}

    /**
     * List users.
     */
    #[QueryParameter('page'), QueryParameter('per_page')]
    public function index()
    {
        $users = $this->userService->getPaginatedUsers($this->getPerPage());
        return UserResource::collection($users);
    }

    /**
     * Create users.
     */
    public function store(CreateUserRequest $request)
    {
        $input = $request->validated();
        $user = $this->userService->storeUser($input);
        return new UserResource($user);
    }

    /**
     * Read users.
     */
    public function show($id)
    {
        $user = $this->userService->getUser((int)$id);
        return new UserResource($user);
    }

    /**
     * Update users.
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $input = $request->validated();
        $user = $this->userService->updateUser((int)$id, $input);
        return new UserResource($user);
    }

    /**
     * Delete users
     */
    public function destroy($id)
    {
        $this->userService->deleteUser((int)$id);

        return $this->successResponse([], message: 'User deleted successfully',);
    }
}
