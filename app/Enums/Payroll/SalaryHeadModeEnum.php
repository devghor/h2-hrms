<?php

namespace App\Enums\Payroll;

enum SalaryHeadModeEnum: string
{
    case Cash = 'cash';
    case Bank = 'bank';

    public function label(): string
    {
        return match ($this) {
            self::Cash => 'Cash',
            self::Bank => 'Bank',
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
