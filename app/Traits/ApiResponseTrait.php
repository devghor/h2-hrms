<?php

declare(strict_types=1);

namespace App\Traits;

use App\Enums\StatusCodeEnum;

trait ApiResponseTrait
{
    public static function successResponse($data, $message = null, $code = StatusCodeEnum::ACCEPTED, $headers = [])
    {
        return response()->json([
            'message' => $message,
            'data' => $data
        ], $code, $headers);
    }

    public static function errorResponse($error, $message = null, $code = StatusCodeEnum::UNPROCESSABLE_ENTITY, $headers = [])
    {
        return response()->json([
            'message' => $message,
            'error' => $error,
        ], $code, $headers);
    }
}
