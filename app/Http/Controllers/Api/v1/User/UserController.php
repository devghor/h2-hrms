<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\User;

use App\Http\Controllers\Api\v1\Core\CoreController;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Resources\v1\User\UserResource;
use App\Models\User;
use App\Services\User\UserService;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

final class UserController extends CoreController
{
    public function __construct(private UserService $userService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = QueryBuilder::for(User::class)
            ->allowedFilters(['name', 'email'])
            ->paginate($this->getPerPage());

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
     * Show the specified resource.
     */
    public function show($id)
    {
        //

        return response()->json([]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //

        return response()->json([]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //

        return response()->json([]);
    }
}
