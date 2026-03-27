<?php

namespace App\DataTables\Employee\Employee;

use App\DataTables\BaseDataTable;
use App\Models\Employee\Employee\Employee;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;

class EmployeesDataTable extends BaseDataTable
{
    protected bool $fastExcel = true;

    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addColumn('department', fn (Employee $e) => $e->department?->name ?? '')
            ->addColumn('designation', fn (Employee $e) => $e->designation?->name ?? '')
            ->editColumn('hire_date', fn (Employee $e) => $e->hire_date?->format('Y-m-d') ?? '')
            ->editColumn('status', fn (Employee $e) => $e->status ? 'Active' : 'Inactive')
            ->editColumn('created_at', fn (Employee $e) => $e->created_at->format('Y-m-d H:i:s'))
            ->setRowId('id');
    }

    public function query(Employee $model): QueryBuilder
    {
        return $model->with(['department', 'designation'])
            ->select(['id', 'employee_code', 'full_name', 'first_name', 'last_name', 'email', 'phone', 'department_id', 'designation_id', 'employment_status', 'hire_date', 'status', 'created_at']);
    }

    public function getColumns(): array
    {
        return [
            Column::make('id')->title('ID'),
            Column::make('employee_code')->title('Code'),
            Column::make('full_name')->title('Name'),
            Column::make('email')->title('Email'),
            Column::make('phone')->title('Phone'),
            Column::computed('department')->title('Department'),
            Column::computed('designation')->title('Designation'),
            Column::make('employment_status')->title('Status'),
            Column::make('hire_date')->title('Hire Date'),
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
        return 'Employees_' . date('YmdHis');
    }
}
