<?php

namespace App\DataTables\Configuration\Branch;

use App\DataTables\BaseDataTable;
use App\Models\Configuration\Branch\Branch;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;

class BranchesDataTable extends BaseDataTable
{
    protected bool $fastExcel = true;

    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addColumn('company', fn (Branch $b) => $b->company?->name ?? '')
            ->editColumn('created_at', fn (Branch $b) => $b->created_at->format('Y-m-d H:i:s'))
            ->setRowId('id');
    }

    public function query(Branch $model): QueryBuilder
    {
        return $model->with('company')->select(['id', 'company_id', 'name', 'short_name', 'code', 'email', 'phone', 'mobile', 'created_at']);
    }

    public function getColumns(): array
    {
        return [
            Column::make('id')->title('ID'),
            Column::computed('company')->title('Company'),
            Column::make('name')->title('Name'),
            Column::make('short_name')->title('Short Name'),
            Column::make('code')->title('Code'),
            Column::make('email')->title('Email'),
            Column::make('phone')->title('Phone'),
            Column::make('mobile')->title('Mobile'),
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
        return 'Branches_' . date('YmdHis');
    }
}
