<?php

namespace App\Enums\Payroll;

enum SalaryHeadCategoryEnum: string
{
    case Gross      = 'gross';
    case Benefit    = 'benefit';
    case Deduction  = 'deduction';
    case Adjustment = 'adjustment';

    public function label(): string
    {
        return match ($this) {
            self::Gross      => 'Gross',
            self::Benefit    => 'Benefit',
            self::Deduction  => 'Deduction',
            self::Adjustment => 'Adjustment',
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
