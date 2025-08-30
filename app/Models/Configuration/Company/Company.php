<?php

namespace App\Models\Configuration\Company;

use App\Models\Uam\User;
use Stancl\Tenancy\Database\Models\Tenant;

class Company extends Tenant
{
    protected $table = 'companies';

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    /**
     * custom columns (that won't be stored in the data JSON column)
     */
    public static function getCustomColumns(): array
    {
        return [
            'id',
            'company_name',
            'company_short_name'
        ];
    }

    public function getIncrementing()
    {
        return true;
    }
}
