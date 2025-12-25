<?php

namespace App\Http\Middleware;

use App\Models\Configuration\Company\Company;
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
        $companyId = session(config('tenancy.current_company_session_key'));
        if ($companyId && $company = Company::find($companyId)) {
            tenancy()->initialize($company);
        }

        return $next($request);
    }
}
