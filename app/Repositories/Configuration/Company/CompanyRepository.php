<?php

namespace App\Repositories\Configuration\Company;

use App\Models\Configuration\Company\Company;
use App\Repositories\Core\CoreRepository;
use Illuminate\Support\Facades\Auth;

class CompanyRepository extends CoreRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model(): string
    {
        return Company::class;
    }

    /**
     * Save a new entity in repository
     *
     * @param array $attributes
     *
     * @return mixed
     * @throws ValidatorException
     *
     */
    public function create(array $attributes)
    {
        $model = $this->model->newInstance($attributes);
        $model->save();
        Auth::user()->companies()->save($model);
        return $model;
    }

    public function isAuthUserCompany(int $companyId): bool
    {
        return Auth::user()->companies->contains('id', $companyId);
    }
}
