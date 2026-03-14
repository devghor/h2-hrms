<?php

namespace App\DataTables;

use App\Models\Uam\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Illuminate\Support\Collection;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Services\DataTable;

class UsersDataTable extends DataTable
{
    /**
     * Use fast-excel for Excel export (no maatwebsite/excel required).
     */
    protected bool $fastExcel = true;

    /**
     * Handle DataTable routing for Inertia apps.
     * Centralises ajax/export dispatch so the controller only calls this one method.
     */
    public function renderInertia(string $component, array $props = [])
    {
        if (request()->query('data-table')) {
            $action = request('action');

            if (in_array($action, ['excel', 'csv', 'pdf', 'print'])) {
                return app()->call([$this, $action === 'print' ? 'printPreview' : $action]);
            }

            return app()->call([$this, 'ajax']);
        }

        return inertia($component, $props);
    }

    /**
     * Build the DataTable class.
     */
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->editColumn('created_at', fn (User $u) => $u->created_at->format('Y-m-d H:i:s'))
            ->setRowId('id');
    }

    /**
     * Base query for the DataTable.
     */
    public function query(User $model): QueryBuilder
    {
        return $model->select(['id', 'name', 'email', 'created_at']);
    }

    /**
     * Column definitions — drives both table rendering and export.
     */
    public function getColumns(): array
    {
        return [
            Column::make('id')->title('ID'),
            Column::make('name')->title('Name'),
            Column::make('email')->title('Email'),
            Column::make('created_at')->title('Created At'),
        ];
    }

    /**
     * Provide export columns directly from getColumns() so the HTML builder
     * (which is unused in this Inertia app) is not consulted.
     */
    protected function exportColumns(): Collection
    {
        return collect($this->getColumns());
    }

    /**
     * Provide print columns directly from getColumns().
     */
    protected function printColumns(): array|Collection
    {
        return collect($this->getColumns());
    }

    /**
     * PDF export via DomPDF using Yajra's built-in print view.
     */
    public function pdf()
    {
        return Pdf::loadView($this->printPreview, ['data' => $this->getDataForPrint()])
            ->setPaper('a4', 'landscape')
            ->download($this->getFilename() . '.pdf');
    }

    /**
     * Export filename.
     */
    protected function filename(): string
    {
        return 'Users_' . date('YmdHis');
    }
}
