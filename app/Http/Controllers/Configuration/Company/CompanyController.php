<?php

namespace App\Http\Controllers\Configuration\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Company\StoreCompanyRequest;
use App\Http\Requests\Configuration\Company\UpdateCompanyRequest;
use App\Models\Configuration\Company\Company;
use App\Repositories\Configuration\Company\CompanyRepository;
use Yajra\DataTables\Facades\DataTables;

class CompanyController extends Controller
{
    public function __construct(private CompanyRepository $companyRepository) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (request()->query('data-table')) {
            return DataTables::eloquent(Company::query())
                ->editColumn('created_at', function ($company) {
                    return $company->created_at->format('Y-m-d H:i:s');
                })
                ->editColumn('updated_at', function ($company) {
                    return $company->updated_at->format('Y-m-d H:i:s');
                })
                ->rawColumns(['action'])
                ->make(true);
        }

        return inertia('configuration/companies/index');
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
        $input = $request->validated();
        $input['company_id'] = tenant()->id;
        $this->companyRepository->create($input);
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
        $input  = $request->validated();
        $this->companyRepository->update($input, $id);
        return redirect()->route('configuration.companies.index')->with([
            'success' => __('Company updated successfully.'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->companyRepository->delete($id);
        return redirect()->route('configuration.companies.index')->with([
            'success' => __('Company deleted successfully.'),
        ]);
    }

    public function switchCompany(Company $company)
    {
        $isUserCompany = $this->companyRepository->isAuthUserCompany($company->id);

        if ($isUserCompany) {
            tenancy()->initialize($company);
            session()->put(config('tenancy.current_company_session_key'), $company->id);
        }

        return redirect()->back();
    }
}
