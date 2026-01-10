<?php

namespace App\Exports;

use App\Models\Uam\Role;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RolesExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Role::query()->with('permissions');

        // Apply filters if provided
        if (!empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc');
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Description',
            'Guard Name',
            'Permissions Count',
            'Permissions',
            'Created At',
            'Updated At',
        ];
    }

    public function map($role): array
    {
        return [
            $role->id,
            $role->name,
            $role->description,
            $role->guard_name,
            $role->permissions->count(),
            $role->permissions->pluck('name')->implode(', '),
            $role->created_at?->format('Y-m-d H:i:s'),
            $role->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
