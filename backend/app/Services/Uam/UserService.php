<?php

namespace App\Services\Uam;

use App\Models\Uam\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function getAllUsers(Request $request): LengthAwarePaginator
    {
        $query = User::query();

        // Apply filters manually
        if ($request->filled('ulid')) {
            $query->where('ulid', $request->input('ulid'));
        }

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->input('email') . '%');
        }

        if ($request->filled('tenant_id')) {
            $query->where('tenant_id', 'like', '%' . $request->input('tenant_id') . '%');
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->input('from_date'));
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->input('to_date'));
        }

        // Apply sorting
        if ($request->filled('sort_by')) {
            $sortBy = $request->input('sort_by');
            $sortOrder = $request->input('sort_order', 'asc');

            // Validate sort column
            $allowedSorts = ['ulid', 'name', 'email', 'tenant_id', 'created_at', 'updated_at'];
            if (in_array($sortBy, $allowedSorts)) {
                $query->orderBy($sortBy, $sortOrder);
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate($request->input('per_page', 15));
    }

    public function createUser(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        $data['tenant_id'] = tenant('id');

        return User::create($data);
    }

    public function updateUser(User $user, array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return $user->fresh();
    }

    public function deleteUser(User $user): void
    {
        $user->delete();
    }
}
