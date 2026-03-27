<?php

namespace App\Repositories\Employee\Employee;

use App\Models\Employee\Employee\Employee;
use App\Repositories\Core\CoreRepository;

class EmployeeRepository extends CoreRepository
{
    public function model(): string
    {
        return Employee::class;
    }

    public function create(array $attributes)
    {
        if (empty($attributes['full_name'])) {
            $attributes['full_name'] = trim(($attributes['first_name'] ?? '') . ' ' . ($attributes['last_name'] ?? ''));
        }

        $model = $this->model->newInstance($attributes);
        $model->save();

        return $model;
    }

    public function getEmployeeOptions()
    {
        return $this->model->select('id', 'full_name', 'first_name', 'last_name')->get()
            ->map(fn ($e) => ['id' => $e->id, 'name' => $e->full_name ?: "{$e->first_name} {$e->last_name}"]);
    }
}
