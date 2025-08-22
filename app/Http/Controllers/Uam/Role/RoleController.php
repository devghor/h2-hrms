<?php

namespace App\Http\Controllers\Uam\Role;

use App\DataTables\Uam\Role\RolesDataTable;
use App\Http\Controllers\Controller;
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

        $validated['tenant_id'] = tenant()?->id;

        $role = $this->roleRepository->create($validated);
        return redirect()->back()->with('success', 'Role created successfully.');
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'description' => 'nullable|string',
        ]);
        $this->roleRepository->update($validated, $role->id);
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
