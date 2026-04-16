<?php

namespace App\Enums\Payroll;

enum SalaryHeadTaxCalculationTypeEnum: string
{
    case Percentage = 'percentage';
    case Fixed      = 'fixed';
    case None       = 'none';

    public function label(): string
    {
        return match ($this) {
            self::Percentage => 'Percentage',
            self::Fixed      => 'Fixed',
            self::None       => 'None',
        };
    }

    public static function options(): array
    {
        return array_map(
            fn (self $case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases(),
        );
    }
}
