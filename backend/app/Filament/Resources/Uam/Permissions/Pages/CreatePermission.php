<?php

namespace App\Filament\Resources\Uam\Permissions\Pages;

use App\Filament\Resources\Uam\Permissions\PermissionResource;
use Filament\Resources\Pages\CreateRecord;

class CreatePermission extends CreateRecord
{
    protected static string $resource = PermissionResource::class;
}
