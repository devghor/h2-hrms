<?php

namespace App\Filament\Resources\Uam\Permissions\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PermissionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make([
                    TextInput::make('name')
                        ->required(),
                    TextInput::make('guard_name')
                        ->required(),
                    TextInput::make('display_name'),
                    TextInput::make('module'),
                    TextInput::make('group'),
                ])->columns(2)->columnSpanFull(),
            ]);
    }
}
