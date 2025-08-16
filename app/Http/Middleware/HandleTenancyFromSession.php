<?php

namespace App\Http\Middleware;

use App\Models\Tenancy\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleTenancyFromSession
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenantId = session(config('tenancy.current_tenant_key'));
        if ($tenantId && $tenant = Tenant::find($tenantId)) {
            tenancy()->initialize($tenant);
        }

        return $next($request);
    }
}
