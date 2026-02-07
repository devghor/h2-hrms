<?php

namespace App\Filament\Clusters;

use BackedEnum;
use Filament\Clusters\Cluster;

class Uam extends Cluster
{
    protected static BackedEnum | string | null $navigationIcon = 'heroicon-o-user-group';

    protected static ?string $navigationLabel = 'UAM';

    protected static ?string $slug = 'uam';

    protected static ?int $navigationSort = 10;
}
