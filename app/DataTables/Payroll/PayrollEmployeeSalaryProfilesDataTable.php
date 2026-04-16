<?php

namespace App\DataTables\Payroll;

use App\DataTables\BaseDataTable;
use App\Models\Employee\Employee\Employee;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;

class PayrollEmployeeSalaryProfilesDataTable extends BaseDataTable
{
    protected bool $fastExcel = true;

    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->editColumn('employee_status', fn (Employee $e) => $e->employee_status?->label() ?? '—')
            ->editColumn('created_at', fn (Employee $e) => $e->created_at->format('Y-m-d H:i:s'))
            ->setRowId('user_id');
    }

    public function query(Employee $model): QueryBuilder
    {
        return $model
            ->selectRaw('
                employees.id,
                employees.user_id,
                employees.employee_code,
                employees.full_name,
                designations.name as designation_name,
                COALESCE(profiles.basic_amount, 0) as basic_amount,
                COALESCE(profiles.gross_amount, 0) as gross_amount,
                COALESCE(profiles.deduction_amount, 0) as deduction_amount,
                COALESCE(profiles.net_amount, 0) as net_amount,
                employees.employee_status,
                employees.created_at
            ')
            ->leftJoin('designations', 'designations.id', '=', 'employees.designation_id')
            ->leftJoin('payroll_employee_salary_profiles as profiles', function ($join) {
                $join->on('profiles.user_id', '=', 'employees.user_id')
                    ->where('profiles.is_active', true);
            });
    }

    public function getColumns(): array
    {
        return [
            Column::make('id')->title('ID'),
            Column::make('employee_code')->title('Employee Code'),
            Column::make('full_name')->title('Full Name'),
            Column::computed('designation_name')->title('Designation'),
            Column::make('basic_amount')->title('Basic'),
            Column::make('gross_amount')->title('Gross'),
            Column::make('deduction_amount')->title('Deduction'),
            Column::make('net_amount')->title('Net'),
            Column::make('employee_status')->title('Employee Status'),
            Column::make('created_at')->title('Joined'),
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
        return 'PayrollEmployeeSalaryProfiles_' . date('YmdHis');
    }
}
