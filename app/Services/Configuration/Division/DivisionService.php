<?php

namespace App\Services\Configuration\Division;

use App\Models\Configuration\Division\Division;
use App\Services\Core\CoreService;
use Illuminate\Database\Eloquent\Collection;

class DivisionService extends CoreService
{
    protected function model(): string
    {
        return Division::class;
    }

    public function getDivisionOptions(): Collection
    {
        return $this->model->select('id', 'name')->get();
    }
}
