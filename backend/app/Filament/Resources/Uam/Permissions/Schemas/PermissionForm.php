<?php

namespace App\Filament\Resources\Uam\Permissions\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PermissionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('guard_name')
                    ->required(),
                TextInput::make('display_name'),
                TextInput::make('module'),
                TextInput::make('group'),
            ]);
    }
}
