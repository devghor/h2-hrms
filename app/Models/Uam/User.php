<?php

namespace App\Models\Uam;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\Uam\GlobalRoleEnum;
use App\Models\Configuration\Company\Company;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, BelongsToTenant;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'company_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $guard_name = ['web'];


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function guardName()
    {
        return ['web'];
    }


    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function isSuperAdmin()
    {
        return $this->global_role == GlobalRoleEnum::SuperAdmin->value;
    }
}
