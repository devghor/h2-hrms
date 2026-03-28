<?php

namespace App\Services\Configuration\Company;

use App\Models\Configuration\Company\Company;
use App\Services\Core\CoreService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class CompanyService extends CoreService
{
    protected function model(): string
    {
        return Company::class;
    }

    public function create(array $data): Model
    {
        $company = $this->model->create($data);
        Auth::user()->companies()->save($company);

        return $company;
    }

    public function isAuthUserCompany(int $companyId): bool
    {
        return Auth::user()->companies->contains('id', $companyId);
    }

    public function getCompanyOptions(): Collection
    {
        return $this->model->select('id', 'name')->get();
    }
}
