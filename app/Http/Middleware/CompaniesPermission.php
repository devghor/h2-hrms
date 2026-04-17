<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Permission\PermissionRegistrar;
use Symfony\Component\HttpFoundation\Response;

class CompaniesPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!empty(auth()->user())) {
            app(PermissionRegistrar::class)->setPermissionsTeamId(tenant('id'));
            setPermissionsTeamId(tenant('id'));
        }

        return $next($request);
    }
}
