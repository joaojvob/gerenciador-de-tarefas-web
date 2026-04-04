<?php

namespace App\Http\Controllers\Api\Workspace;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use App\Http\Requests\Workspace\UpdateMemberRoleRequest;
use App\Http\Requests\Workspace\InviteMemberRequest;
use App\Actions\Workspace\UpdateMemberRoleAction;
use App\Http\Resources\WorkspaceMemberResource;
use App\Actions\Workspace\InviteMemberAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\WorkspaceMember;
use Illuminate\Http\Request;
use App\Models\Workspace;
use App\Models\User;

class WorkspaceMemberController extends Controller
{
    public function index(Request $request, Workspace $workspace): AnonymousResourceCollection
    {
        $this->authorize('view', $workspace);

        $members = $workspace->workspaceMembers()
            ->with(['user', 'inviter'])
            ->get();

        return WorkspaceMemberResource::collection($members);
    }

    public function store(
        InviteMemberRequest $request,
        Workspace $workspace,
        InviteMemberAction $action
    ): JsonResponse {
        $this->authorize('inviteMember', $workspace);

        $member = $action->execute($request, $workspace, $request->user());
        $member->load(['user', 'inviter']);

        return response()->json([
            'message' => 'Membro adicionado com sucesso.',
            'member'  => WorkspaceMemberResource::make($member),
        ], 201);
    }

    public function update(
        UpdateMemberRoleRequest $request,
        Workspace $workspace,
        User $member,
        UpdateMemberRoleAction $action
    ): JsonResponse {
        $this->authorize('updateMemberRole', $workspace);

        $workspaceMember = $action->execute($request, $workspace, $member);
        $workspaceMember->load(['user', 'inviter']);

        return response()->json([
            'message' => 'Papel do membro atualizado com sucesso.',
            'member'  => WorkspaceMemberResource::make($workspaceMember),
        ]);
    }

    public function destroy(Request $request, Workspace $workspace, User $member): JsonResponse
    {
        $this->authorize('removeMember', [$workspace, $member]);

        WorkspaceMember::where('workspace_id', $workspace->id)
            ->where('user_id', $member->id)
            ->delete();

        return response()->json(['message' => 'Membro removido com sucesso.']);
    }
}
