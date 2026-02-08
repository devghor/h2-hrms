<?php

namespace App\Filament\Resources\Uam\Roles\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RoleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->schema([
                        Select::make('tenant_id')
                            ->relationship('tenant', 'name'),
                        TextInput::make('name')
                            ->required(),
                        TextInput::make('description'),
                        TextInput::make('guard_name')
                            ->required(),
                    ])->columns(2)->columnSpanFull(),
            ]);
    }
}
