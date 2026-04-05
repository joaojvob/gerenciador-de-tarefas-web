<?php

namespace App\Actions\Workspace;

use App\Http\Requests\Workspace\UpdateMemberRoleRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;
use App\Enums\WorkspaceMemberRole;
use App\Models\WorkspaceMember;
use App\Models\Workspace;
use App\Models\User;

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
        $payload = $request->validated();

        $member = WorkspaceMember::where('workspace_id', $workspace->id)->where('user_id', $target->id)->firstOrFail();

        $updatingRole = array_key_exists('role', $payload);
        $updatingPermissions = array_key_exists('permissions', $payload);

        if (($updatingRole || $updatingPermissions) && $member->role === WorkspaceMemberRole::Owner) {
            throw new HttpResponseException(
                response()->json(['message' => 'O papel do owner não pode ser alterado.'], 422)
            );
        }

        $previousRole = $member->role->value;

        if (array_key_exists('name', $payload) || array_key_exists('email', $payload)) {
            $target->fill([
                'name' => $payload['name'] ?? $target->name,
                'email' => $payload['email'] ?? $target->email,
            ]);
            $target->save();
        }

        $memberData = [];

        if ($updatingRole) {
            $memberData['role'] = $payload['role'];
        }

        if ($updatingPermissions || $updatingRole) {
            $currentPermissions = $member->permissions ?? [];
            $incomingPermissions = $payload['permissions'] ?? [];
            $mergedPermissions = array_merge($currentPermissions, $incomingPermissions);

            if (($memberData['role'] ?? $member->role->value) === WorkspaceMemberRole::Admin->value) {
                $mergedPermissions['can_create_tasks'] = true;
            }

            $memberData['permissions'] = $mergedPermissions;
        }

        if (! empty($memberData)) {
            $member->update($memberData);
        }

        Log::info('Papel de membro atualizado.', [
            'workspace_id'  => $workspace->id,
            'user_id'       => $target->id,
            'previous_role' => $previousRole,
            'new_role'      => $memberData['role'] ?? $previousRole,
            'permissions'   => $memberData['permissions'] ?? null,
        ]);

        return $member->fresh();
    }
}
