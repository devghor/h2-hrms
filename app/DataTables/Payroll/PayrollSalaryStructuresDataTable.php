<?php

namespace App\DataTables\Payroll;

use App\DataTables\BaseDataTable;
use App\Models\Payroll\PayrollSalaryStructure;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;

class PayrollSalaryStructuresDataTable extends BaseDataTable
{
    protected bool $fastExcel = true;

    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addColumn('designation_name', fn (PayrollSalaryStructure $s) => $s->designation?->name ?? '')
            ->editColumn('is_active', fn (PayrollSalaryStructure $s) => $s->is_active ? 'Active' : 'Inactive')
            ->editColumn('effective_date', fn (PayrollSalaryStructure $s) => $s->effective_date?->format('Y-m-d') ?? '')
            ->editColumn('created_at', fn (PayrollSalaryStructure $s) => $s->created_at->format('Y-m-d H:i:s'))
            ->setRowId('id');
    }

    public function query(PayrollSalaryStructure $model): QueryBuilder
    {
        $query = $model->with('designation')->select([
            'id',
            'designation_id',
            'basic',
            'annual_increment_percentage',
            'effective_date',
            'is_active',
            'created_at',
        ]);

        if ($designationId = request('designation_id')) {
            $query->where('designation_id', $designationId);
        }

        if (($status = request('status_filter')) !== null && $status !== '') {
            $query->where('is_active', (bool) (int) $status);
        }

        if ($from = request('created_at_from')) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to = request('created_at_to')) {
            $query->whereDate('created_at', '<=', $to);
        }

        return $query;
    }

    public function getColumns(): array
    {
        return [
            Column::make('id')->title('ID'),
            Column::computed('designation_name')->title('Designation'),
            Column::make('basic')->title('Basic'),
            Column::make('annual_increment_percentage')->title('Annual Increment %'),
            Column::make('effective_date')->title('Effective Date'),
            Column::make('is_active')->title('Status'),
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
        return 'PayrollSalaryStructures_' . date('YmdHis');
    }
}
