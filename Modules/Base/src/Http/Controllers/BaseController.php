<?php

declare(strict_types=1);

namespace Modules\Base\Http\Controllers;

use Illuminate\Routing\Controller;
use Modules\Base\Traits\ApiResponseTrait;

class BaseController extends Controller
{
    use ApiResponseTrait;

    protected function getPerPage(): int
    {
        return min(request()->get('per_page', config('base.pagination.default')), config('base.pagination.max'));
    }
}
