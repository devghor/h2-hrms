<?php

namespace App\Http\Controllers\Uam\Role;

use App\DataTables\Uam\Role\RolesDataTable;
use App\Http\Controllers\Controller;
use App\Models\Uam\Permission;
use App\Models\Uam\Role;
use App\Repositories\Uam\Role\RoleRepository;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct(private RoleRepository $roleRepository) {}

    public function index(RolesDataTable $dataTable)
    {
        if (request()->query('data-table')) {
            return $dataTable->ajax();
        }
        return inertia('uam/roles/index');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string',
        ]);

        $validated['company_id'] = tenant()?->id;

        $role = $this->roleRepository->create($validated);
        return redirect()->back()->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        // Get all permissions, grouped by module if needed
        $allPermissions = Permission::all()->map(function ($perm) {
            return [
                'id' => $perm->id,
                'module' => $perm->module,
                'group' => $perm->group,
                'name' => $perm->name,
                'display_name' => $perm->display_name,
            ];
        });

        // Get role's permission ids
        $rolePermissions = $role->permissions()->pluck('id')->toArray();

        return inertia('uam/roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'description' => $role->description,
                'permissions' => $rolePermissions,
            ],
            'allPermissions' => $allPermissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $input = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
        ]);
        $this->roleRepository->update($input, $role->id);
        return redirect()->back()->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->roleRepository->delete($id);

        return redirect()->route('uam.roles.index')->with([
            'success' => 'Role deleted successfully.',
        ]);
    }
}
