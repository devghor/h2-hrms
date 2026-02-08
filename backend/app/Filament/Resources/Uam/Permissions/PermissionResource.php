<?php

namespace App\Filament\Resources\Uam\Permissions;

use App\Filament\Clusters\Uam;
use App\Filament\Resources\Uam\Permissions\Pages\CreatePermission;
use App\Filament\Resources\Uam\Permissions\Pages\EditPermission;
use App\Filament\Resources\Uam\Permissions\Pages\ListPermissions;
use App\Filament\Resources\Uam\Permissions\Schemas\PermissionForm;
use App\Filament\Resources\Uam\Permissions\Tables\PermissionsTable;
use App\Models\Uam\Permission;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

class PermissionResource extends Resource
{
    protected static ?string $model = Permission::class;

    protected static ?string $cluster = Uam::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-shield-check';

    public static function form(Schema $schema): Schema
    {
        return PermissionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PermissionsTable::configure($table);
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
            'index' => ListPermissions::route('/'),
            'create' => CreatePermission::route('/create'),
            'edit' => EditPermission::route('/{record}/edit'),
        ];
    }
}
