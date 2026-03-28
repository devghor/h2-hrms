<?php

namespace App\Services\Configuration\Branch;

use App\Models\Configuration\Branch\Branch;
use App\Services\Core\CoreService;
use Illuminate\Database\Eloquent\Collection;

class BranchService extends CoreService
{
    protected function model(): string
    {
        return Branch::class;
    }

    public function getBranchOptions(): Collection
    {
        return $this->model->select('id', 'name')->get();
    }
}
