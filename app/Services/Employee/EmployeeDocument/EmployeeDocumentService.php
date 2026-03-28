<?php

namespace App\Services\Employee\EmployeeDocument;

use App\Models\Employee\EmployeeDocument\EmployeeDocument;
use App\Services\Core\CoreService;

class EmployeeDocumentService extends CoreService
{
    protected function model(): string
    {
        return EmployeeDocument::class;
    }
}
