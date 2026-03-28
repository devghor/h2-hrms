<?php

namespace App\Services\Configuration\Desk;

use App\Models\Configuration\Desk\Desk;
use App\Services\Core\CoreService;

class DeskService extends CoreService
{
    protected function model(): string
    {
        return Desk::class;
    }
}
