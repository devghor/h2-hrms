<?php

namespace App\DataTables\Payroll;

use App\DataTables\BaseDataTable;
use App\Models\Payroll\PayrollSalaryHead;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;

class PayrollSalaryHeadsDataTable extends BaseDataTable
{
    protected bool $fastExcel = true;

    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->editColumn('category', fn (PayrollSalaryHead $h) => $h->category?->label() ?? '')
            ->editColumn('identification_type', fn (PayrollSalaryHead $h) => $h->identification_type?->label() ?? '')
            ->editColumn('mode', fn (PayrollSalaryHead $h) => $h->mode?->label() ?? '')
            ->editColumn('is_active', fn (PayrollSalaryHead $h) => $h->is_active ? 'Active' : 'Inactive')
            ->editColumn('created_at', fn (PayrollSalaryHead $h) => $h->created_at->format('Y-m-d H:i:s'))
            ->setRowId('id');
    }

    public function query(PayrollSalaryHead $model): QueryBuilder
    {
        return $model->select([
            'id',
            'name',
            'code',
            'category',
            'identification_type',
            'mode',
            'is_active',
            'position',
            'created_at',
        ]);
    }

    public function getColumns(): array
    {
        return [
            Column::make('id')->title('ID'),
            Column::make('name')->title('Name'),
            Column::make('code')->title('Code'),
            Column::make('category')->title('Category'),
            Column::make('identification_type')->title('Type'),
            Column::make('mode')->title('Mode'),
            Column::make('is_active')->title('Status'),
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
        return 'PayrollSalaryHeads_' . date('YmdHis');
    }
}
