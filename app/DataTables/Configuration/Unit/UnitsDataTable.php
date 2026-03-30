<?php

namespace App\DataTables\Configuration\Unit;

use App\DataTables\BaseDataTable;
use App\Models\Configuration\Unit\Unit;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;

class UnitsDataTable extends BaseDataTable
{
    protected bool $fastExcel = true;

    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addColumn('department', fn (Unit $u) => $u->department?->name ?? '')
            ->editColumn('created_at', fn (Unit $u) => $u->created_at->format('Y-m-d H:i:s'))
            ->setRowId('id');
    }

    public function query(Unit $model): QueryBuilder
    {
        return $model->with('department')->select(['id', 'name', 'code', 'department_id', 'description', 'created_at']);
    }

    public function getColumns(): array
    {
        return [
            Column::make('id')->title('ID'),
            Column::make('name')->title('Name'),
            Column::make('code')->title('Code'),
            Column::computed('department')->title('Department'),
            Column::make('description')->title('Description'),
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
        return 'Units_' . date('YmdHis');
    }
}
