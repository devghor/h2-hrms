<?php

use App\Helpers\ApiResponse;
use App\Enums\HttpStatus;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Register custom middleware aliases
        $middleware->alias([
            'auth' => \App\Http\Middleware\Authenticate::class,
            'permission' => \App\Http\Middleware\CheckPermission::class,
            'role' => \App\Http\Middleware\CheckRole::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'validate.token.expiration' => \App\Http\Middleware\ValidateTokenExpiration::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Validation Exception
        $exceptions->render(function (ValidationException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return ApiResponse::validationError($e->errors());
            }
        });

        // Authentication Exception
        $exceptions->render(function (AuthenticationException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return ApiResponse::unauthenticated('You must be authenticated to access this resource.');
            }
        });

        // Authorization Exception
        $exceptions->render(function (AuthorizationException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return ApiResponse::unauthorized($e->getMessage() ?: 'You are not authorized to perform this action.');
            }
        });

        // Model Not Found Exception
        $exceptions->render(function (ModelNotFoundException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return ApiResponse::notFound('The requested resource was not found.');
            }
        });

        // Not Found HTTP Exception
        $exceptions->render(function (NotFoundHttpException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return ApiResponse::notFound('The requested endpoint does not exist.');
            }
        });

        // Method Not Allowed Exception
        $exceptions->render(function (MethodNotAllowedHttpException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return ApiResponse::error('Method not allowed', ['method' => ['The HTTP method is not allowed for this endpoint.']], HttpStatus::METHOD_NOT_ALLOWED->value);
            }
        });

        // HTTP Exception
        $exceptions->render(function (HttpException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return ApiResponse::error($e->getMessage() ?: 'HTTP error occurred', ['http' => [$e->getMessage()]], $e->getStatusCode());
            }
        });

        // Default Exception Handler
        $exceptions->render(function (Throwable $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                $message = 'Internal server error';
                $errors = ['server' => ['An unexpected error occurred. Please try again later.']];

                if (config('app.debug')) {
                    $message = $e->getMessage();
                    $errors = [
                        'exception' => get_class($e),
                        'message' => $e->getMessage(),
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                        'trace' => collect($e->getTrace())->take(5)->toArray(),
                    ];
                }

                return ApiResponse::error($message, $errors, HttpStatus::INTERNAL_SERVER_ERROR->value);
            }
        });
    })->create();

