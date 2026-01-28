<?php

namespace App\Filament\Widgets;

use App\Models\Uam\User;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class UserChartWidget extends ChartWidget
{
    protected ?string $heading = 'User Registration Trend';

    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 1;

    protected function getData(): array
    {
        return [
            'datasets' => [
                [
                    'label' => 'New Users',
                    'data' => 2,
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                    'borderColor' => 'rgb(59, 130, 246)',
                    'fill' => true,
                ],
            ],
            'labels' => [],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array
    {
        return [
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'ticks' => [
                        'stepSize' => 1,
                    ],
                ],
            ],
            'plugins' => [
                'legend' => [
                    'display' => true,
                ],
            ],
        ];
    }
}
