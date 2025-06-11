<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\v1\Core;

use App\Traits\ApiResponseTrait;
use Illuminate\Routing\Controller;

class CoreController extends Controller
{
    use ApiResponseTrait;

    protected function getPerPage(): int
    {
        return min((int)request()->get('per_page', config('core.pagination.default')), config('core.pagination.max'));
    }
}
