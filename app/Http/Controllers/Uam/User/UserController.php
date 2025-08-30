<?php

namespace App\Http\Controllers\Uam\User;

use App\DataTables\Uam\User\UsersDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Uam\User\StoreUserRequest;
use App\Http\Requests\Uam\User\UpdateUserRequest;
use App\Http\Resources\Uam\User\UserResource;
use App\Repositories\Uam\User\UserRepository;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function __construct(private UserRepository $userRepository) {}

    /**
     * Display a listing of the resource for the Inertia view.
     */
    public function index(UsersDataTable $dataTable)
    {
        if (request()->query('data-table')) {
            return $dataTable->ajax();
        }

        return inertia('uam/users/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $input = $request->validated();
        $user = $this->userRepository->create($input);

        return inertia('uam/users/index', [
            'user' => new UserResource($user),
            'success' => 'User created successfully.',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, string $id)
    {
        $this->userRepository->update($request->validated(), $id);

        return redirect()->route('uam.users.index')->with([
            'success' => 'User updated successfully.',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->userRepository->delete($id);

        return redirect()->route('uam.users.index')->with([
            'success' => 'User deleted successfully.',
        ]);
    }
}
