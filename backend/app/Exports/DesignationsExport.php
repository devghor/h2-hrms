<?php

namespace App\Exports;

use App\Models\Base\Designation;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DesignationsExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Designation::query();

        // Apply filters if provided
        if (!empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (!empty($this->filters['level'])) {
            $query->where('level', $this->filters['level']);
        }

        if (!empty($this->filters['include_deleted'])) {
            $query->withTrashed();
        }

        return $query->orderBy('level', 'asc');
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Description',
            'Level',
            'Created At',
            'Updated At',
            'Deleted At',
        ];
    }

    public function map($designation): array
    {
        return [
            $designation->ulid,
            $designation->name,
            $designation->description,
            $designation->level,
            $designation->created_at?->format('Y-m-d H:i:s'),
            $designation->updated_at?->format('Y-m-d H:i:s'),
            $designation->deleted_at?->format('Y-m-d H:i:s'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
