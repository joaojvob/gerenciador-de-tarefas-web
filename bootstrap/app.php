<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (AuthenticationException $e, Request $request): JsonResponse {
            return response()->json(['message' => 'Não autenticado.'], 401);
        });

        $exceptions->render(function (AccessDeniedHttpException $e, Request $request): JsonResponse {
            return response()->json(['message' => 'Acesso não autorizado.'], 403);
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request): JsonResponse {
            return response()->json(['message' => 'Recurso não encontrado.'], 404);
        });

        $exceptions->render(function (ValidationException $e, Request $request): JsonResponse {
            return response()->json([
                'message' => 'Dados inválidos.',
                'errors'  => $e->errors(),
            ], 422);
        });
    })->create();
