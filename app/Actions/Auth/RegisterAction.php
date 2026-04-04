<?php

namespace App\Actions\Auth;

use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Enums\WorkspaceMemberRole;
use App\Models\Workspace;
use App\Models\User;
use Exception;

class RegisterAction
{
    /**
     * Registra um novo usuário e cria seu workspace pessoal.
     *
     * @return array{user: User, token: string}
     */
    public function execute(RegisterRequest $request): array
    {
        try {
            DB::beginTransaction();

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
                'role'      => WorkspaceMemberRole::Owner->value,
                'joined_at' => now(),
            ]);

            $token = $user->createToken('api-token')->plainTextToken;

            DB::commit();

            Log::info('Novo usuário registrado.', [
                'user_id'      => $user->id,
                'email'        => $user->email,
                'workspace_id' => $workspace->id,
            ]);

            return compact('user', 'token');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Falha na validação do registro!', [
                'trace'  => $e->getTraceAsString(),
                'error'  => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
