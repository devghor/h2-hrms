<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Uam;

use App\Http\Controllers\Api\v1\Core\CoreController;
use App\Http\Requests\v1\Uam\CreateUserRequest;
use App\Http\Requests\v1\Uam\UpdateUserRequest;
use App\Http\Resources\v1\Uam\UserResource;
use App\Services\v1\Uam\UserService;

/**
 * @tags Uam
 */
final class UserController extends CoreController
{
    public function __construct(private UserService $userService) {}

    /**
     * Users List
     */
    public function index()
    {
        $users = $this->userService->getPaginatedUsers($this->getPerPage());
        return UserResource::collection($users);
    }

    /**
     * Users Create
     */
    public function store(CreateUserRequest $request)
    {
        $input = $request->validated();
        $user = $this->userService->storeUser($input);
        return new UserResource($user);
    }

    /**
     * Users Read
     */
    public function show($id)
    {
        $user = $this->userService->getUser((int)$id);
        return new UserResource($user);
    }

    /**
     * Users Update
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $input = $request->validated();
        $user = $this->userService->updateUser((int)$id, $input);
        return new UserResource($user);
    }

    /**
     * Users Delete
     */
    public function destroy($id)
    {
        $this->userService->deleteUser((int)$id);
        return $this->successResponse([], message: 'User deleted successfully',);
    }
}
