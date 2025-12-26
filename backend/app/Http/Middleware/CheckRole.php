<?php

namespace App\Http\Middleware;

use App\Helpers\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string|array  $role
     * @param  string  $guard
     */
    public function handle(Request $request, Closure $next, string $role, ?string $guard = null): Response
    {
        $guard = $guard ?? config('auth.defaults.guard');

        if (auth($guard)->guest()) {
            return ApiResponse::unauthenticated('You must be authenticated to access this resource.');
        }

        $roles = is_array($role)
            ? $role
            : explode('|', $role);

        if (!auth($guard)->user()->hasAnyRole($roles)) {
            return ApiResponse::unauthorized('You do not have the required role to access this resource.');
        }

        return $next($request);
    }
}
