<?php

namespace App\Filament\Resources\Uam\Users;

use App\Enums\Navigation\NavigationGroupEnum;
use App\Filament\Resources\Uam\Users\Pages\CreateUser;
use App\Filament\Resources\Uam\Users\Pages\EditUser;
use App\Filament\Resources\Uam\Users\Pages\ListUsers;
use App\Filament\Resources\Uam\Users\Schemas\UserForm;
use App\Filament\Resources\Uam\Users\Tables\UsersTable;
use App\Models\Uam\User;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static string | UnitEnum | null $navigationGroup = NavigationGroupEnum::Uam;

    public static function form(Schema $schema): Schema
    {
        return UserForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UsersTable::configure($table);
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
            'index' => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'edit' => EditUser::route('/{record}/edit'),
        ];
    }
}
