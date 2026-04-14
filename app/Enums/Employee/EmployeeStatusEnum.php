<?php

namespace App\Enums\Employee;

enum EmployeeStatusEnum: int
{
    case OnProbation        = 1;
    case Confirmed          = 2;
    case ResignationPending = 4;
    case ResignationAccepted = 5;
    case Released           = 6;
    case Suspended          = 7;
    case DischargeRequested = 8;
    case DischargeApproved  = 9;
    case Discharged         = 10;
    case Dismissed          = 11;
    case Retired            = 12;
    case Deceased           = 13;
    case DismissalRequested = 14;
    case DismissalApproved  = 15;
    case FundReleased       = 16;
    case Others             = 99;

    public function label(): string
    {
        return match ($this) {
            self::OnProbation        => 'On Probation',
            self::Confirmed          => 'Confirmed',
            self::ResignationPending => 'Resignation Pending',
            self::ResignationAccepted => 'Resignation Accepted',
            self::Released           => 'Released',
            self::Suspended          => 'Suspended',
            self::DischargeRequested => 'Discharge Requested',
            self::DischargeApproved  => 'Discharge Approved',
            self::Discharged         => 'Discharged',
            self::Dismissed          => 'Dismissed',
            self::Retired            => 'Retired',
            self::Deceased           => 'Deceased',
            self::DismissalRequested => 'Dismissal Requested',
            self::DismissalApproved  => 'Dismissal Approved',
            self::FundReleased       => 'Fund Released',
            self::Others             => 'Others',
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
