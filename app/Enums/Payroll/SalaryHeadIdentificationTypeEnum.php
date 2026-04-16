<?php

namespace App\Enums\Payroll;

enum SalaryHeadIdentificationTypeEnum: string
{
    case Basic               = 'basic';
    case Lfa                 = 'lfa';
    case PfEmployee          = 'pf_employee';
    case PfEmployer          = 'pf_employer';
    case PfEmployerDeduction = 'pf_employer_deduction';
    case Other               = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Basic               => 'Basic',
            self::Lfa                 => 'LFA',
            self::PfEmployee          => 'PF Employee',
            self::PfEmployer          => 'PF Employer',
            self::PfEmployerDeduction => 'PF Employer Deduction',
            self::Other               => 'Other',
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
