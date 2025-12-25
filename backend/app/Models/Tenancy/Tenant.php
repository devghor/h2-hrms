<?php

namespace App\Models\Tenancy;

use App\Traits\HasUlidAttribute;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Database\Concerns\HasDomains;

class Tenant extends BaseTenant
{
    use HasUlidAttribute;

    /**
     * To store some data in custom columns,
     * i.e. not the JSON data column, add the names of these columns to the array returned
     */
    public static function getCustomColumns(): array
    {
        return array_merge(parent::getCustomColumns(), [
            'ulid',
            'name',
            'slug',
        ]);
    }

    public function getTenantKeyName(): string
    {
        return 'ulid';
    }

    public function getTenantKey(): int|string
    {
        return $this->getAttribute($this->getTenantKeyName());
    }
}
