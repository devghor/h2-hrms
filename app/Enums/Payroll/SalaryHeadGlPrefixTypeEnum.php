<?php

namespace App\Enums\Payroll;

enum SalaryHeadGlPrefixTypeEnum: string
{
    case Dynamic = 'dynamic';
    case Static  = 'static';

    public function label(): string
    {
        return match ($this) {
            self::Dynamic => 'Dynamic',
            self::Static  => 'Static',
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
