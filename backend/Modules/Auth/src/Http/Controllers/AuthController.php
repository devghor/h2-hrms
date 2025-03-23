<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Modules\Base\Http\Controllers\BaseController;
use App\Models\User;
use Exception;

class AuthController extends BaseController
{
    /**
     * Handle user login and return access & refresh tokens.
     */
    public function login(Request $request)
    {
        try {
            // Validate request
            $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);

            // Check credentials
            if (!Auth::attempt($request->only('email', 'password'))) {
                return $this->errorResponse('Invalid credentials', [], 401);
            }

            // Get authenticated user
            $user = Auth::user();

            // Delete old tokens
            $user->tokens()->delete();

            // Create new access & refresh tokens
            $accessToken = $user->createToken('access_token', ['*'], now()->addMinutes(15))->plainTextToken;
            $refreshToken = $user->createToken('refresh_token', ['refresh'], now()->addDays(7))->plainTextToken;

            return $this->successResponse('Login successful', [
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'token_type' => 'Bearer',
                'user' => $user
            ]);
        } catch (Exception $e) {
            return $this->errorResponse('Something went wrong', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Refresh access token using refresh token.
     */
    public function refreshToken(Request $request)
    {
        try {
            $request->validate([
                'refresh_token' => 'required'
            ]);

            // Find user by refresh token
            $user = User::whereHas('tokens', function ($query) use ($request) {
                $query->where('token', hash('sha256', $request->refresh_token))
                    ->where('name', 'refresh_token');
            })->first();

            if (!$user) {
                return $this->errorResponse('Invalid refresh token', [], 401);
            }

            // Delete old access tokens
            $user->tokens()->where('name', 'access_token')->delete();

            // Create new access token
            $newAccessToken = $user->createToken('access_token', ['*'], now()->addMinutes(15))->plainTextToken;

            return $this->successResponse('Token refreshed successfully', [
                'access_token' => $newAccessToken,
                'token_type' => 'Bearer'
            ]);
        } catch (Exception $e) {
            return $this->errorResponse('Failed to refresh token', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Logout user and revoke all tokens.
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->tokens()->delete();
            return $this->successResponse('Logged out successfully');
        } catch (Exception $e) {
            return $this->errorResponse('Logout failed', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get authenticated user details.
     */
    public function user(Request $request)
    {
        try {
            return $this->successResponse('User fetched successfully', $request->user());
        } catch (Exception $e) {
            return $this->errorResponse('Failed to fetch user data', ['error' => $e->getMessage()], 500);
        }
    }
}
