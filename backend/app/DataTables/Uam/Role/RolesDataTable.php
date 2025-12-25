<?php

namespace App\DataTables\Uam\Role;

use App\Models\Uam\Role;
use Yajra\DataTables\Services\DataTable;

class RolesDataTable extends DataTable
{
    public function dataTable($query)
    {
        return datatables()
            ->eloquent($query)
            ->filterColumn('id', function ($query, $keyword): void {
                $query->where('id', $keyword);
            });
    }

    public function query(Role $model)
    {
        return $model->newQuery();
    }

    public function html()
    {
        return $this->builder()
            ->setTableId('roles-table')
            ->columns($this->getColumns());
    }

    protected function getColumns()
    {
        return [
            'id',
            'name',
            'description',
            'created_at',
            'updated_at',
            'action',
        ];
    }
}
