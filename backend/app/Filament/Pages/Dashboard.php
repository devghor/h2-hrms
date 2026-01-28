<?php

namespace App\Filament\Pages;

use BackedEnum;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-home';

    protected string $view = 'filament.pages.dashboard';

    /**
     * @return int | array<string, ?int>
     */
    public function getColumns(): int | array
    {
        return 2;
    }


    protected function getHeaderWidgets(): array
    {
        return [
            \App\Filament\Widgets\StatsOverviewWidget::class,
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
        ];
    }
}
