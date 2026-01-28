<?php

namespace App\Filament\Widgets;

use App\Models\Uam\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Total Users', User::count())
                ->description('All registered users')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('success')
                ->chart($this->getUsersChartData()),

            Stat::make('Active Users', User::count())
                ->description('Currently active users')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('primary'),

            Stat::make('Total Roles', Role::count())
                ->description('Available roles in the system')
                ->descriptionIcon('heroicon-m-shield-check')
                ->color('warning'),

            Stat::make('Total Permissions', Permission::count())
                ->description('Available permissions')
                ->descriptionIcon('heroicon-m-key')
                ->color('info'),
        ];
    }

    private function getUsersChartData(): array
    {
        $users = User::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count')
            ->toArray();

        return array_pad($users, 7, 0);
    }
}
