<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Uam;

use App\Http\Controllers\Api\v1\Core\CoreController;
use App\Http\Requests\v1\Uam\CreateUserRequest;
use App\Http\Requests\v1\Uam\UpdateUserRequest;
use App\Http\Resources\v1\Uam\UserResource;
use App\Services\v1\Uam\UserService;

/**
 * @group Auth
 *
 * APIs for managing users (CRUD)
 */
final class UserController extends CoreController
{
    public function __construct(private UserService $userService) {}

    /**
     * List users.
     *
     * @queryParam page int The page number for pagination. Example: 1
     * @queryParam per_page int The number of items per page. Example: 10
     * @authenticated
     */
    public function index()
    {
        $users = $this->userService->getPaginatedUsers($this->getPerPage());
        return UserResource::collection($users);
    }

    /**
     * Create a user.
     *
     * @bodyParam name string required The user's name. Example: John Doe
     * @bodyParam email string required The user's email. Example: john@example.com
     * @bodyParam password string required The user's password. Example: secret123
     * @authenticated
     */
    public function store(CreateUserRequest $request)
    {
        $input = $request->validated();
        $user = $this->userService->storeUser($input);
        return new UserResource($user);
    }

    /**
     * Read a user.
     *
     * @urlParam id int required The ID of the user. Example: 1
     * @authenticated
     */
    public function show($id)
    {
        $user = $this->userService->getUser((int)$id);
        return new UserResource($user);
    }

    /**
     * Update a user.
     *
     * @urlParam id int required The ID of the user. Example: 1
     * @bodyParam name string The user's name. Example: John Doe
     * @bodyParam email string The user's email. Example: john@example.com
     * @bodyParam password string The user's password. Example: secret123
     * @authenticated
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $input = $request->validated();
        $user = $this->userService->updateUser((int)$id, $input);
        return new UserResource($user);
    }

    /**
     * Delete a user.
     *
     * @urlParam id int required The ID of the user. Example: 1
     * @response 200 {"message": "User deleted successfully"}
     * @authenticated
     */
    public function destroy($id)
    {
        $this->userService->deleteUser((int)$id);
        return $this->successResponse([], message: 'User deleted successfully',);
    }
}
