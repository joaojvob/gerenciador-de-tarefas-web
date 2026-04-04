<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Actions\Auth\RegisterAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Log;
use App\Actions\Auth\LoginAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(RegisterRequest $request, RegisterAction $action): JsonResponse
    {
        $result = $action->execute($request);

        return response()->json([
            'message' => 'Cadastro realizado com sucesso.',
            'user'    => UserResource::make($result['user']),
            'token'   => $result['token'],
        ], 201);
    }

    public function login(LoginRequest $request, LoginAction $action): JsonResponse
    {
        $result = $action->execute($request);

        return response()->json([
            'message' => 'Login realizado com sucesso.',
            'user'    => UserResource::make($result['user']),
            'token'   => $result['token'],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        Log::info('Usuário deslogado.', ['user_id' => $request->user()->id]);

        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => UserResource::make($request->user()),
        ]);
    }
}
