<?php

namespace App\Services\Configuration\Designation;

use App\Models\Configuration\Designation\Designation;
use App\Services\Core\CoreService;
use Illuminate\Database\Eloquent\Collection;

class DesignationService extends CoreService
{
    protected function model(): string
    {
        return Designation::class;
    }

    public function getDesignationOptions(): Collection
    {
        return $this->model->select('id', 'name')->get();
    }
}
