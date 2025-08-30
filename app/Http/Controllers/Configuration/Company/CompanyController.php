<?php

namespace App\Http\Controllers\Configuration\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Company\StoreCompanyRequest;
use App\Repositories\Configuration\Company\CompanyRepository;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function __construct(private CompanyRepository $companyRepository) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
