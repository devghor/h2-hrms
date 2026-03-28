<?php

namespace App\Services\Core;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class CoreService
{
    protected Model $model;

    public function __construct()
    {
        $this->model = app($this->model());
    }

    abstract protected function model(): string;

    public function all(array $columns = ['*']): Collection
    {
        return $this->model->get($columns);
    }

    public function find($id): Model
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(array $data, $id): Model
    {
        $record = $this->find($id);
        $record->update($data);

        return $record;
    }

    public function delete($id): bool
    {
        return (bool) $this->find($id)->delete();
    }

    public function bulkDelete(array $ids): int
    {
        return $this->model->whereIn('id', $ids)->delete();
    }
}
