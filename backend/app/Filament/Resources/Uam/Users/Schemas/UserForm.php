<?php

namespace App\Filament\Resources\Uam\Users\Schemas;

use App\Models\Uam\Role;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->schema([
                        TextInput::make('tenant_id')
                            ->required()
                            ->numeric(),
                        TextInput::make('name')
                            ->required(),
                        TextInput::make('email')
                            ->label('Email address')
                            ->email()
                            ->required(),
                        DateTimePicker::make('email_verified_at'),
                        TextInput::make('password')
                            ->password()
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->dehydrated(fn ($state) => filled($state))
                            ->revealable(),
                    ])->columns(2)->columnSpanFull(),

                Section::make('Roles')
                    ->schema([
                        CheckboxList::make('roles')
                            ->relationship('roles', 'name')
                            ->options(Role::all()->pluck('name', 'id'))
                            ->searchable()
                            ->bulkToggleable()
                            ->columns(2),
                    ])->columnSpanFull(),
            ]);
    }
}
