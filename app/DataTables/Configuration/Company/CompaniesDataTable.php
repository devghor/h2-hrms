<?php

namespace App\DataTables\Configuration\Company;

use App\Models\Configuration\Company\Company;
use Illuminate\Support\Facades\Auth;
use Yajra\DataTables\Services\DataTable;

class CompaniesDataTable extends DataTable
{
    public function dataTable($query)
    {
        return datatables()
            ->eloquent($query);
    }

    public function query(Company $model)
    {
        return $model->newQuery()->whereHas('users', fn($q) => $q->where('user_id', Auth::id()));
    }

    public function html()
    {
        return $this->builder()
            ->setTableId('companies-table')
            ->columns($this->getColumns());
    }

    protected function getColumns()
    {
        return [
            'id',
            'company_name',
            'company_short_name',
            'created_at',
            'updated_at',
        ];
    }
}
