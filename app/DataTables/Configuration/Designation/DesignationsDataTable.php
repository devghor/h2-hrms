<?php

namespace App\DataTables\Configuration\Designation;

use App\DataTables\BaseDataTable;
use App\Models\Configuration\Designation\Designation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;

class DesignationsDataTable extends BaseDataTable
{
    protected bool $fastExcel = true;

    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->editColumn('created_at', fn (Designation $d) => $d->created_at->format('Y-m-d H:i:s'))
            ->setRowId('id');
    }

    public function query(Designation $model): QueryBuilder
    {
        return $model->select(['id', 'name', 'code', 'description', 'position', 'created_at']);
    }

    public function getColumns(): array
    {
        return [
            Column::make('id')->title('ID'),
            Column::make('name')->title('Name'),
            Column::make('code')->title('Code'),
            Column::make('description')->title('Description'),
            Column::make('position')->title('Position'),
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
        return 'Designations_' . date('YmdHis');
    }
}
