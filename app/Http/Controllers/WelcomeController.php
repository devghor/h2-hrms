<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WelcomeController
{

    public function index(Request $request)
    {
        return view('welcome');
    }
}
