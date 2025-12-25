<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $result = $this->authService->register($validated);

        return ApiResponse::created('User registered successfully', $result);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $response = Http::asForm()->post(env('APP_URL') . '/oauth/token', [
            'grant_type' => 'password',
            'client_id' => config('passport.client_id'),
            'client_secret' => config('passport.client_secret'),
            'username' => $validated['email'],
            'password' => $validated['password'],
            'scope' => '',
        ]);

        if ($response->failed()) {
            return ApiResponse::error('The provided credentials are incorrect.', [], 401);
        }

        // return a proper JsonResponse using the ApiResponse helper
        return ApiResponse::success('Logged in successfully', $response->json());
    }

    public function me(Request $request): JsonResponse
    {
        return ApiResponse::success('User profile retrieved', [
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return ApiResponse::success('Logged out successfully');
    }

    public function refresh(Request $request): JsonResponse
    {
        $result = $this->authService->refreshToken($request->user());

        return ApiResponse::success('Token refreshed successfully', $result);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $this->authService->changePassword($request->user(), $validated);

        return ApiResponse::success('Password changed successfully');
    }
}
