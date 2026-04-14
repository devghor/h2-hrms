<?php

namespace App\Services\Employee\Employee;

use App\Models\Employee\Employee\Employee;
use App\Models\Uam\User;
use App\Services\Core\CoreService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EmployeeService extends CoreService
{
    protected function model(): string
    {
        return Employee::class;
    }

    public function create(array $data): Model
    {
        if (empty($data['full_name'])) {
            $data['full_name'] = trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));
        }

        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name'     => $data['full_name'],
                'email'    => $data['email'],
                'password' => Str::random(16),
            ]);

            $data['user_id'] = $user->id;

            return $this->model->create($data);
        });
    }

    public function getEmployeeOptions(): array
    {
        return $this->model->select('id', 'full_name', 'first_name', 'last_name')->get()
            ->map(fn ($e) => ['id' => $e->id, 'name' => $e->full_name ?: "{$e->first_name} {$e->last_name}"])
            ->all();
    }
}
