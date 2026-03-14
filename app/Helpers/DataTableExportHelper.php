<?php

namespace App\Helpers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;

class DataTableExportHelper
{
    /**
     * Export query as a PDF download using DomPDF.
     *
     * Reads DataTables column search and order params from the current request
     * so filters & sorting applied in the table are reflected in the export.
     *
     * @param  Builder  $query     Base Eloquent query (un-paginated)
     * @param  array    $columns   ['accessorKey' => 'Header Label', ...]
     * @param  string   $title     Title shown at the top of the PDF
     * @param  string   $filename  Downloaded file name (without extension)
     */
    public static function pdf(
        Builder $query,
        array $columns,
        string $title = 'Export',
        string $filename = 'export',
    ) {
        // Apply column-level search filters from DataTables request
        $requestColumns = request()->input('columns', []);
        $colKeys = array_keys($columns);

        foreach ($requestColumns as $col) {
            $field  = $col['data']           ?? $col['name'] ?? null;
            $search = $col['search']['value'] ?? '';

            if ($search !== '' && $field !== null && in_array($field, $colKeys, true)) {
                $query->where($field, 'like', "%{$search}%");
            }
        }

        // Apply ordering
        $orderInfo    = request()->input('order.0', []);
        $orderColIdx  = (int) ($orderInfo['column'] ?? 0);
        $orderDir     = in_array($orderInfo['dir'] ?? 'asc', ['asc', 'desc']) ? $orderInfo['dir'] : 'asc';

        if (isset($colKeys[$orderColIdx])) {
            try {
                $query->orderBy($colKeys[$orderColIdx], $orderDir);
            } catch (\Exception) {
                // Ignore ordering on computed/aliased columns
            }
        }

        $rows = $query->get()->map(
            fn ($row) => collect($colKeys)
                ->mapWithKeys(fn ($key) => [$key => $row->{$key} ?? ''])
                ->toArray()
        );

        $pdf = Pdf::loadView('exports.datatable-pdf', [
            'title'   => $title,
            'columns' => $columns,
            'rows'    => $rows,
        ])->setPaper('a4', 'landscape');

        return $pdf->download("{$filename}.pdf");
    }
}
