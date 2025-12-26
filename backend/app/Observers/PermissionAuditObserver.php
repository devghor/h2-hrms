<?php

namespace App\Observers;

use Illuminate\Support\Facades\Log;

class PermissionAuditObserver
{
    /**
     * Log permission grant
     */
    public function granted($user, $ability, $result, $arguments): void
    {
        if (config('app.log_permissions', false)) {
            Log::channel('permissions')->info('Permission Granted', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'ability' => $ability,
                'arguments' => $arguments,
                'ip' => request()->ip(),
                'timestamp' => now(),
            ]);
        }
    }

    /**
     * Log permission denial
     */
    public function denied($user, $ability, $result, $arguments): void
    {
        Log::channel('permissions')->warning('Permission Denied', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'ability' => $ability,
            'arguments' => $arguments,
            'ip' => request()->ip(),
            'timestamp' => now(),
        ]);
    }
}
