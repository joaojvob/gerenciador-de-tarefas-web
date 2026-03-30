<?php

namespace App\Actions\Workspace;

use App\Enums\WorkspaceMemberRole;
use App\Http\Requests\Workspace\UpdateMemberRoleRequest;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceMember;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class UpdateMemberRoleAction
{
    /**
     * Atualiza o papel de um membro no workspace.
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    public function execute(
        UpdateMemberRoleRequest $request,
        Workspace $workspace,
        User $target
    ): WorkspaceMember {
        $member = WorkspaceMember::where('workspace_id', $workspace->id)
                                  ->where('user_id', $target->id)
                                  ->firstOrFail();

        if ($member->role === WorkspaceMemberRole::Owner) {
            throw new HttpResponseException(
                response()->json(['message' => 'O papel do owner não pode ser alterado.'], 422)
            );
        }

        $previousRole = $member->role->value;

        $member->update(['role' => $request->role]);

        Log::info('Papel de membro atualizado.', [
            'workspace_id'  => $workspace->id,
            'user_id'       => $target->id,
            'previous_role' => $previousRole,
            'new_role'      => $request->role,
        ]);

        return $member->fresh();
    }
}
