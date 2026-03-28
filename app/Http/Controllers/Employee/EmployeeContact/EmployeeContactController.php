<?php

namespace App\Http\Controllers\Employee\EmployeeContact;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\EmployeeContact\StoreEmployeeContactRequest;
use App\Http\Requests\Employee\EmployeeContact\UpdateEmployeeContactRequest;
use App\Services\Employee\EmployeeContact\EmployeeContactService;

class EmployeeContactController extends Controller
{
    public function __construct(private EmployeeContactService $contactService) {}

    public function store(StoreEmployeeContactRequest $request)
    {
        $this->contactService->create($request->validated());

        return redirect()->back()->with('success', 'Contact added successfully.');
    }

    public function update(UpdateEmployeeContactRequest $request, string $id)
    {
        $this->contactService->update($request->validated(), $id);

        return redirect()->back()->with('success', 'Contact updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->contactService->delete($id);

        return redirect()->back()->with('success', 'Contact deleted successfully.');
    }
}
