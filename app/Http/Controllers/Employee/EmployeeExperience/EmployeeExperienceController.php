<?php

namespace App\Http\Controllers\Employee\EmployeeExperience;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\EmployeeExperience\StoreEmployeeExperienceRequest;
use App\Http\Requests\Employee\EmployeeExperience\UpdateEmployeeExperienceRequest;
use App\Services\Employee\EmployeeExperience\EmployeeExperienceService;

class EmployeeExperienceController extends Controller
{
    public function __construct(private EmployeeExperienceService $experienceService) {}

    public function store(StoreEmployeeExperienceRequest $request)
    {
        $this->experienceService->create($request->validated());

        return redirect()->back()->with('success', 'Experience record added successfully.');
    }

    public function update(UpdateEmployeeExperienceRequest $request, string $id)
    {
        $this->experienceService->update($request->validated(), $id);

        return redirect()->back()->with('success', 'Experience record updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->experienceService->delete($id);

        return redirect()->back()->with('success', 'Experience record deleted successfully.');
    }
}
