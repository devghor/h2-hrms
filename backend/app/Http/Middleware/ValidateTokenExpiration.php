<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;

class ValidateTokenExpiration
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->currentAccessToken()) {
            $token = $user->currentAccessToken();
            
            // Strict expiration check with current timestamp
            if ($token->expires_at) {
                $now = Carbon::now();
                $expiresAt = Carbon::parse($token->expires_at);
                
                // Check if token has expired (no grace period)
                if ($expiresAt->lte($now)) {
                    // Delete the expired token
                    $token->delete();
                    
                    return response()->json([
                        'message' => 'Token has expired.',
                    ], 401);
                }
            }
        }

        return $next($request);
    }
}
