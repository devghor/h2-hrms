<?php

declare(strict_types=1);

namespace Modules\Base\Traits;

use Modules\Base\Enums\StatusCodeEnum;

trait ApiResponseTrait
{
    public static function successResponse($data, $statusCode = StatusCodeEnum::ACCEPTED, $headers = [])
    {
        return response()->json(['data' => $data], $statusCode, $headers);
    }

    public static function errorResponse($message, $statusCode = StatusCodeEnum::UNPROCESSABLE_ENTITY, $headers = [])
    {
        return response()->json(['error' => $message], $statusCode, $headers);
    }
}
