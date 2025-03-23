<?php

namespace Modules\Base\Traits;

trait ApiResponseTrait
{
    /**
     * Success Response
     */
    protected function successResponse($message, $data = [], $status = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $status);
    }

    /**
     * Error Response
     */
    protected function errorResponse($message, $errors = [], $status = 400)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ], $status);
    }
}
