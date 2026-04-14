<?php

namespace App\Models\Employee\EmployeeContact;

use App\Models\Employee\Employee\Employee;
use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class EmployeeContact extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'employee_contacts';

    protected $fillable = [
        'user_id',
        'contact_name',
        'relationship',
        'phone',
    ];
}
