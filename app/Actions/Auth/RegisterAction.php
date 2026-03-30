<?php

namespace App\Actions\Auth;

use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\Log;

class RegisterAction
{
    /**
     * Registra um novo usuário e cria seu workspace pessoal.
     *
     * @return array{user: User, token: string}
     */
    public function execute(RegisterRequest $request): array
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password,
        ]);

        $workspace = Workspace::create([
            'name'     => "Workspace de {$user->name}",
            'owner_id' => $user->id,
            'personal' => true,
        ]);

        $workspace->workspaceMembers()->create([
            'user_id'   => $user->id,
            'role'      => \App\Enums\WorkspaceMemberRole::Owner->value,
            'joined_at' => now(),
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        Log::info('Novo usuário registrado.', [
            'user_id'      => $user->id,
            'email'        => $user->email,
            'workspace_id' => $workspace->id,
        ]);

        return compact('user', 'token');
    }
}
