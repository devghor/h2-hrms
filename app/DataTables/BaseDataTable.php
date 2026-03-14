<?php

namespace App\DataTables;

use Illuminate\Support\Collection;
use Yajra\DataTables\Services\DataTable;

abstract class BaseDataTable extends DataTable
{
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
}
