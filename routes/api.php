<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Task\TaskController;
use App\Http\Controllers\Api\Workspace\WorkspaceController;
use App\Http\Controllers\Api\Workspace\WorkspaceMemberController;
use Illuminate\Support\Facades\Route;

// -----------------------------------------------------------------------------
// Rotas públicas — sem autenticação
// -----------------------------------------------------------------------------

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

// -----------------------------------------------------------------------------
// Rotas protegidas — requerem token Sanctum
// -----------------------------------------------------------------------------

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me',      [AuthController::class, 'me']);
    });

    // Workspaces
    Route::apiResource('workspaces', WorkspaceController::class)
        ->parameters(['workspaces' => 'workspace:slug']);

    // Membros do workspace (aninhado)
    Route::prefix('workspaces/{workspace:slug}/members')->group(function () {
        Route::get('/',          [WorkspaceMemberController::class, 'index']);
        Route::post('/',         [WorkspaceMemberController::class, 'store']);
        Route::patch('{member}', [WorkspaceMemberController::class, 'update']);
        Route::delete('{member}',[WorkspaceMemberController::class, 'destroy']);
    });

    // Tarefas do workspace (aninhado)
    Route::prefix('workspaces/{workspace:slug}/tasks')->group(function () {
        Route::get('/',        [TaskController::class, 'index']);
        Route::post('/',       [TaskController::class, 'store']);
        Route::get('{task}',   [TaskController::class, 'show']);
        Route::patch('{task}', [TaskController::class, 'update']);
        Route::delete('{task}',[TaskController::class, 'destroy']);
    });
});