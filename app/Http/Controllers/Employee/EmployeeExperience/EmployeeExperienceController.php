<?php

namespace App\Http\Controllers\Employee\EmployeeExperience;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\EmployeeExperience\StoreEmployeeExperienceRequest;
use App\Http\Requests\Employee\EmployeeExperience\UpdateEmployeeExperienceRequest;
use App\Repositories\Employee\EmployeeExperience\EmployeeExperienceRepository;

class EmployeeExperienceController extends Controller
{
    public function __construct(private EmployeeExperienceRepository $experienceRepository) {}

    public function store(StoreEmployeeExperienceRequest $request)
    {
        $this->experienceRepository->create($request->validated());

        return redirect()->back()->with('success', 'Experience record added successfully.');
    }

    public function update(UpdateEmployeeExperienceRequest $request, string $id)
    {
        $this->experienceRepository->update($request->validated(), $id);

        return redirect()->back()->with('success', 'Experience record updated successfully.');
    }

    public function destroy(string $id)
    {
        $this->experienceRepository->delete($id);

        return redirect()->back()->with('success', 'Experience record deleted successfully.');
    }
}
