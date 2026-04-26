<?php

namespace App\Http\Controllers\Configuration\Company;

use App\DataTables\Configuration\Company\CompaniesDataTable;
use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Company\StoreCompanyRequest;
use App\Http\Requests\Configuration\Company\UpdateCompanyRequest;
use App\Models\Configuration\Company\Company;
use App\Services\Configuration\Company\CompanyService;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function __construct(private CompanyService $companyService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(CompaniesDataTable $dataTable)
    {
        return $dataTable->renderInertia('configuration/companies/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompanyRequest $request)
    {
        $this->companyService->create($request->validated());
        return redirect()->back()->with('success', 'Company created successfully.');
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
    public function update(UpdateCompanyRequest $request, string $id)
    {
        $this->companyService->update($request->validated(), $id);
        return redirect()->route('configuration.companies.index')->with([
            'success' => __('Company updated successfully.'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->companyService->delete($id);
        return redirect()->route('configuration.companies.index')->with([
            'success' => __('Company deleted successfully.'),
        ]);
    }

    public function switchCompany(Company $company)
    {
        if (auth()->user()->isSuperAdmin()) {
            session()->put(config('tenancy.company_id_session_key'), $company->id);
            tenancy()->initialize($company);
        }

        return redirect()->back();
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->validate(['ids' => 'required|array', 'ids.*' => 'required'])['ids'];
        $this->companyService->bulkDelete($ids);

        return response()->json(['message' => 'Companies deleted successfully.']);
    }
}
