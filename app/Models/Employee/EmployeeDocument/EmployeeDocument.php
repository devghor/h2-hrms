<?php

namespace App\Models\Employee\EmployeeDocument;

use App\Models\Employee\Employee\Employee;
use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class EmployeeDocument extends Model
{
    use HasUlid, BelongsToTenant;

    protected $table = 'employee_documents';

    protected $fillable = [
        'employee_id',
        'document_name',
        'document_type',
        'file_path',
        'uploaded_at',
        'created_by',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
