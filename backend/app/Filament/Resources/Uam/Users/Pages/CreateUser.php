<?php

namespace App\Filament\Resources\Uam\Users\Pages;

use App\Filament\Resources\Uam\Users\UserResource;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;
}
