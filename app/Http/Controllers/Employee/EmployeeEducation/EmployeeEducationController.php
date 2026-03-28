<?php

namespace App\Http\Controllers\Employee\EmployeeEducation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\EmployeeEducation\StoreEmployeeEducationRequest;
use App\Http\Requests\Employee\EmployeeEducation\UpdateEmployeeEducationRequest;
use App\Services\Employee\EmployeeEducation\EmployeeEducationService;

class EmployeeEducationController extends Controller
{
    public function __construct(private EmployeeEducationService $educationService) {}

    public function store(StoreEmployeeEducationRequest $request)
    {
        $this->educationService->create($request->validated());

        return redirect()->back()->with('success', 'Education record added successfully.');
    }

    public function update(UpdateEmployeeEducationRequest $request, string $id)
    {
        $this->educationService->update($request->validated(), $id);

        return redirect()->back()->with('success', 'Education record updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->educationService->delete($id);

        return redirect()->back()->with('success', 'Education record deleted successfully.');
    }
}
