<?php

namespace App\DataTables;

use App\Models\Uam\User;
use Yajra\DataTables\Services\DataTable;

class UsersDataTable extends DataTable
{
    public function query()
    {
        return User::select(['id', 'name', 'email', 'created_at']);
    }

    public function dataTable($query)
    {
        return datatables()
            ->eloquent($query)
            ->filterColumn('id', function ($query, $keyword) {
                $query->where('id', $keyword);
            })
            ->rawColumns(['actions']);
    }

    public function html()
    {
        return $this->builder()
            ->columns([
                ['data' => 'id', 'name' => 'id', 'title' => 'ID'],
                ['data' => 'name', 'name' => 'name', 'title' => 'Name'],
                ['data' => 'email', 'name' => 'email', 'title' => 'Email'],
                ['data' => 'created_at', 'name' => 'created_at', 'title' => 'Created At', 'orderable' => false],
                ['data' => 'actions', 'name' => 'actions', 'title' => 'Actions', 'orderable' => false, 'searchable' => false],
            ]);
    }
}
