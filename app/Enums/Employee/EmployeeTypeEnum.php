<?php

namespace App\Enums\Employee;

enum EmployeeTypeEnum: int
{
    case Permanent   = 1;
    case Contractual = 2;

    public function label(): string
    {
        return match ($this) {
            self::Permanent   => 'Permanent',
            self::Contractual => 'Contractual',
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
