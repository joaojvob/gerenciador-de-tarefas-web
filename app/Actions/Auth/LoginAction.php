<?php

namespace App\Actions\Auth;

use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class LoginAction
{
    /**
     * Autentica o usuário e retorna um token Sanctum.
     *
     * @return array{user: User, token: string}
     *
     * @throws \Illuminate\Auth\AuthenticationException
     */
    public function execute(LoginRequest $request): array
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            Log::warning('Tentativa de login inválida.', ['email' => $request->email]);

            throw new AuthenticationException('Credenciais inválidas.');
        }

        $token = $user->createToken('api-token')->plainTextToken;

        Log::info('Usuário autenticado.', ['user_id' => $user->id]);

        return compact('user', 'token');
    }
}
