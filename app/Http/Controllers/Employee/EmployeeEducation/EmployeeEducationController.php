<?php

namespace App\Http\Controllers\Employee\EmployeeEducation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\EmployeeEducation\StoreEmployeeEducationRequest;
use App\Http\Requests\Employee\EmployeeEducation\UpdateEmployeeEducationRequest;
use App\Repositories\Employee\EmployeeEducation\EmployeeEducationRepository;

class EmployeeEducationController extends Controller
{
    public function __construct(private EmployeeEducationRepository $educationRepository) {}

    public function store(StoreEmployeeEducationRequest $request)
    {
        $this->educationRepository->create($request->validated());

        return redirect()->back()->with('success', 'Education record added successfully.');
    }

    public function update(UpdateEmployeeEducationRequest $request, string $id)
    {
        $this->educationRepository->update($request->validated(), $id);

        return redirect()->back()->with('success', 'Education record updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->educationRepository->delete($id);

        return redirect()->back()->with('success', 'Education record deleted successfully.');
    }
}
