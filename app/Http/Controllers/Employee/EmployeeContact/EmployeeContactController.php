<?php

namespace App\Http\Controllers\Employee\EmployeeContact;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\EmployeeContact\StoreEmployeeContactRequest;
use App\Http\Requests\Employee\EmployeeContact\UpdateEmployeeContactRequest;
use App\Repositories\Employee\EmployeeContact\EmployeeContactRepository;

class EmployeeContactController extends Controller
{
    public function __construct(private EmployeeContactRepository $contactRepository) {}

    public function store(StoreEmployeeContactRequest $request)
    {
        $this->contactRepository->create($request->validated());

        return redirect()->back()->with('success', 'Contact added successfully.');
    }

    public function update(UpdateEmployeeContactRequest $request, string $id)
    {
        $this->contactRepository->update($request->validated(), $id);

        return redirect()->back()->with('success', 'Contact updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->contactRepository->delete($id);

        return redirect()->back()->with('success', 'Contact deleted successfully.');
    }
}
