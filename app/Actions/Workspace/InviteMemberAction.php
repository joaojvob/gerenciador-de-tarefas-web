<?php

namespace App\Actions\Workspace;

use App\Http\Requests\Workspace\InviteMemberRequest;
use App\Jobs\SendWorkspaceInvitationJob;
use Illuminate\Support\Facades\Log;
use App\Enums\WorkspaceMemberRole;
use App\Models\WorkspaceMember;
use App\Models\Workspace;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class InviteMemberAction
{
    /**
     * Adiciona um usuário como membro do workspace e envia convite assíncrono.
     */
    public function execute(InviteMemberRequest $request, Workspace $workspace, User $inviter): WorkspaceMember
    {
        $invitee = User::where('email', $request->email)->firstOrFail();

        $alreadyMember = WorkspaceMember::query()
            ->where('workspace_id', $workspace->id)
            ->where('user_id', $invitee->id)
            ->exists();

        if ($alreadyMember) {
            throw ValidationException::withMessages([
                'email' => 'Este usuário já é membro do workspace.',
            ]);
        }

        $member = $workspace->workspaceMembers()->create([
            'user_id'    => $invitee->id,
            'role'       => WorkspaceMemberRole::Member->value,
            'permissions' => [
                'can_create_tasks' => false,
            ],
            'invited_by' => $inviter->id,
            'joined_at'  => now(),
        ]);

        Log::info('Membro adicionado ao workspace.', [
            'workspace_id' => $workspace->id,
            'user_id'      => $invitee->id,
            'invited_by'   => $inviter->id,
        ]);

        SendWorkspaceInvitationJob::dispatch($workspace, $invitee, $inviter);

        return $member;
    }
}
