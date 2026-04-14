<?php

namespace App\Models\Employee\EmployeeDocument;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class EmployeeDocument extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'employee_documents';

    protected $fillable = [
        'user_id',
        'document_name',
        'document_type',
        'file_path',
        'uploaded_at',
        'created_by',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];
}
