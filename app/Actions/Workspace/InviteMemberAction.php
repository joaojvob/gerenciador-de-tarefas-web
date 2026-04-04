<?php

namespace App\Actions\Workspace;

use App\Http\Requests\Workspace\InviteMemberRequest;
use App\Jobs\SendWorkspaceInvitationJob;
use Illuminate\Support\Facades\Log;
use App\Enums\WorkspaceMemberRole;
use App\Models\WorkspaceMember;
use App\Models\Workspace;
use App\Models\User;

class InviteMemberAction
{
    /**
     * Adiciona um usuário como membro do workspace e envia convite assíncrono.
     */
    public function execute(InviteMemberRequest $request, Workspace $workspace, User $inviter): WorkspaceMember
    {
        $invitee = User::where('email', $request->email)->firstOrFail();

        $member = $workspace->workspaceMembers()->create([
            'user_id'    => $invitee->id,
            'role'       => WorkspaceMemberRole::Member->value,
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
