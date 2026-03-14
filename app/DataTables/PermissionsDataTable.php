<?php

namespace App\DataTables;

use App\Models\Uam\Permission;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;

class PermissionsDataTable extends BaseDataTable
{
    protected bool $fastExcel = true;

    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->editColumn('created_at', fn (Permission $p) => $p->created_at->format('Y-m-d H:i:s'))
            ->setRowId('id');
    }

    public function query(Permission $model): QueryBuilder
    {
        return $model->select(['id', 'name', 'display_name', 'module', 'group', 'guard_name', 'created_at']);
    }

    public function getColumns(): array
    {
        return [
            Column::make('id')->title('ID'),
            Column::make('name')->title('Name'),
            Column::make('display_name')->title('Display Name'),
            Column::make('module')->title('Module'),
            Column::make('group')->title('Group'),
            Column::make('guard_name')->title('Guard Name'),
            Column::make('created_at')->title('Created At'),
        ];
    }

    public function pdf()
    {
        return Pdf::loadView($this->printPreview, ['data' => $this->getDataForPrint()])
            ->setPaper('a4', 'landscape')
            ->download($this->getFilename() . '.pdf');
    }

    protected function filename(): string
    {
        return 'Permissions_' . date('YmdHis');
    }
}
