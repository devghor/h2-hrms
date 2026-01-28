<?php

namespace App\Enums\Navigation;

use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;

enum NavigationGroupEnum implements HasLabel, HasIcon
{
    case Uam;

    public function getLabel(): string
    {
        return match($this) {
            self::Uam => 'UAM',
        };
    }

    public function getIcon(): string
    {
        return match($this) {
            self::Uam => 'heroicon-o-user-group',
        };
    }
}
