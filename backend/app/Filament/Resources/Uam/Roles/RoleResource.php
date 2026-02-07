<?php

namespace App\Filament\Resources\Uam\Roles;

use App\Filament\Clusters\Uam;
use App\Filament\Resources\Uam\Roles\Pages\CreateRole;
use App\Filament\Resources\Uam\Roles\Pages\EditRole;
use App\Filament\Resources\Uam\Roles\Pages\ListRoles;
use App\Filament\Resources\Uam\Roles\Schemas\RoleForm;
use App\Filament\Resources\Uam\Roles\Tables\RolesTable;
use App\Models\Uam\Role;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

class RoleResource extends Resource
{
    protected static ?string $model = Role::class;

    protected static ?string $cluster = Uam::class;

    public static function form(Schema $schema): Schema
    {
        return RoleForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return RolesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRoles::route('/'),
            'create' => CreateRole::route('/create'),
            'edit' => EditRole::route('/{record}/edit'),
        ];
    }
}
