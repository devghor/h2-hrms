<?php

namespace App\DataTables\Uam\Permission;

use App\Models\Uam\Permission;
use Yajra\DataTables\Services\DataTable;

class PermissionsDataTable extends DataTable
{
    public function dataTable($query)
    {
        return datatables()
            ->eloquent($query);
    }

    public function query(Permission $model)
    {
        return $model->newQuery();
    }

    public function html()
    {
        return $this->builder()
            ->setTableId('permissions-table')
            ->columns($this->getColumns());
    }

    protected function getColumns()
    {
        return [
            'id',
            'name',
            'guard_name',
            'created_at',
            'updated_at',
            'actions',
        ];
    }
}
