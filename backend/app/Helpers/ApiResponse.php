<?php

namespace App\Helpers;

use App\Enums\HttpStatus;
use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(string $message = 'Success', array $data = [], ?int $status = null): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status ?? HttpStatus::OK->value);
    }

    public static function created(string $message = 'Resource created successfully', array $data = [], ?int $status = null): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status ?? HttpStatus::CREATED->value);
    }

    public static function error(string $message = 'An error occurred', array $errors = [], ?int $status = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status ?? HttpStatus::BAD_REQUEST->value);
    }

    public static function validationError(array $errors = [], string $message = 'Validation failed', ?int $status = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status ?? HttpStatus::UNPROCESSABLE_ENTITY->value);
    }

    public static function unauthorized(string $message = 'Unauthorized', array $errors = [], ?int $status = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status ?? HttpStatus::FORBIDDEN->value);
    }

    public static function unauthenticated(string $message = 'Unauthenticated', array $errors = [], ?int $status = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status ?? HttpStatus::UNAUTHORIZED->value);
    }

    public static function notFound(string $message = 'Resource not found', array $errors = [], ?int $status = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status ?? HttpStatus::NOT_FOUND->value);
    }

    public static function noContent(): JsonResponse
    {
        return response()->json(null, HttpStatus::NO_CONTENT->value);
    }
}
