<?php

namespace App\Http\Controllers\Uam;

use App\DataTables\UsersDataTable;
use App\Http\Controllers\Controller;
use App\Http\Resources\Uam\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Yajra\DataTables\DataTables;

class UserController extends Controller
{
    /**
     * Display a listing of the resource for the Inertia view.
     */
    public function index(UsersDataTable $dataTable)
    {
        if (request()->query('data-table')) {
            return $dataTable->ajax();
        }

        return inertia('uam/users/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
