<?php

declare(strict_types=1);

use App\Exceptions\UnprocessableEntityException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $request = request();

        if ($request->expectsJson()) {
            $exceptions->render(function (Exception $e) {
                $status = 500;
                $responseData = [];

                $logData = [
                    'timestamp' => now()->toDateTimeString(),
                    'method' => request()->getMethod(),
                    'url' => request()->fullUrl(),
                    'ip' => request()->ip(),
                    'user' => auth()->id(),
                    'message' => $e->getMessage(),
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'data' => request()->except(['password', 'password_confirmation']),
                ];

                switch (true) {
                    case $e instanceof \Illuminate\Validation\ValidationException:
                        $status = 422;
                        $responseData = [
                            'success' => false,
                            'message' => 'Validation failed',
                            'errors' => $e->errors(),
                        ];
                        break;

                    case $e instanceof \Illuminate\Auth\AuthenticationException:
                        $status = 401;
                        $responseData = [
                            'success' => false,
                            'message' => 'Unauthenticated',
                        ];
                        break;

                    case $e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException:
                    case $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException:
                        $status = 404;
                        $responseData = [
                            'success' => false,
                            'message' => 'Resource not found',
                        ];
                        break;

                    case $e instanceof UnprocessableEntityException:
                        $status = 422;
                        $responseData = [
                            'success' => false,
                            'message' => $e->getMessage(),
                            'errors' => method_exists($e, 'getErrors') ? $e->getErrors() : [],
                        ];
                        break;

                    default:
                        $status = 500;
                        $responseData = [
                            'success' => false,
                            'message' => 'Server error',
                            'details' => config('app.debug') ? $e->getMessage() : null,
                        ];
                        break;
                }

                // Log the error (except maybe for validation if too noisy)
                if (!($e instanceof \Illuminate\Validation\ValidationException)) {
                    Log::error('Exception caught:', $logData);
                }

                return new JsonResponse($responseData, $status);
            });
        }
    })->create();
