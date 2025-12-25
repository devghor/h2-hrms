<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Concerns\HasUlids;

trait HasUlidAttribute
{
    use HasUlids;

    /**
     * Columns that should receive ULIDs.
     */
    protected function uniqueIds(): array
    {
        return ['ulid'];
    }

    /**
     * Use ULID for route model binding.
     */
    public function getRouteKeyName(): string
    {
        return 'ulid';
    }
}
