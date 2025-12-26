<?php

namespace App\Http\Middleware;

use App\Helpers\ApiResponse;
use App\Enums\HttpStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string|array  $permission
     * @param  string  $guard
     */
    public function handle(Request $request, Closure $next, string $permission, ?string $guard = null): Response
    {
        $guard = $guard ?? config('auth.defaults.guard');

        if (auth($guard)->guest()) {
            return ApiResponse::unauthenticated('You must be authenticated to access this resource.');
        }

        $permissions = is_array($permission)
            ? $permission
            : explode('|', $permission);

        foreach ($permissions as $permission) {
            if (auth($guard)->user()->can($permission)) {
                return $next($request);
            }
        }

        return ApiResponse::unauthorized('You do not have the required permission to access this resource.');
    }
}
