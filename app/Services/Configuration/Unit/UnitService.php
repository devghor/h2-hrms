<?php

namespace App\Services\Configuration\Unit;

use App\Models\Configuration\Unit\Unit;
use App\Services\Core\CoreService;
use Illuminate\Database\Eloquent\Collection;

class UnitService extends CoreService
{
    protected function model(): string
    {
        return Unit::class;
    }

    public function getUnitOptions(): Collection
    {
        return $this->model->select('id', 'name')->get();
    }
}
