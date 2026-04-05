<?php

namespace App\Http\Controllers\Api\Workspace;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use App\Http\Requests\Workspace\RegisterMemberRequest;
use App\Http\Requests\Workspace\UpdateMemberRoleRequest;
use App\Http\Requests\Workspace\InviteMemberRequest;
use App\Actions\Workspace\UpdateMemberRoleAction;
use App\Http\Resources\WorkspaceMemberResource;
use App\Actions\Workspace\InviteMemberAction;
use App\Http\Controllers\Controller;
use App\Jobs\SendWorkspaceInvitationJob;
use App\Enums\TaskStatus;
use App\Enums\WorkspaceMemberRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Models\WorkspaceMember;
use App\Models\Task;
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

    public function register(
        RegisterMemberRequest $request,
        Workspace $workspace
    ): JsonResponse {
        $this->authorize('inviteMember', $workspace);

        $member = DB::transaction(function () use ($request, $workspace) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
            ]);

            $member = $workspace->workspaceMembers()->create([
                'user_id' => $user->id,
                'role' => WorkspaceMemberRole::Member->value,
                'permissions' => [
                    'can_create_tasks' => false,
                ],
                'invited_by' => $request->user()->id,
                'joined_at' => now(),
            ]);

            SendWorkspaceInvitationJob::dispatch($workspace, $user, $request->user());

            return $member;
        });

        $member->load(['user', 'inviter']);

        return response()->json([
            'message' => 'Membro cadastrado e vinculado ao workspace com sucesso.',
            'member' => WorkspaceMemberResource::make($member),
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
            'message' => 'Membro atualizado com sucesso.',
            'member'  => WorkspaceMemberResource::make($workspaceMember),
        ]);
    }

    public function destroy(Request $request, Workspace $workspace, User $member): JsonResponse
    {
        $this->authorize('removeMember', [$workspace, $member]);

        DB::transaction(function () use ($workspace, $member) {
            Task::query()
                ->where('workspace_id', $workspace->id)
                ->where('assigned_to', $member->id)
                ->update([
                    'assigned_to' => null,
                    'status' => TaskStatus::Pending->value,
                ]);

            WorkspaceMember::where('workspace_id', $workspace->id)
                ->where('user_id', $member->id)
                ->delete();
        });

        return response()->json([
            'message' => 'Membro removido com sucesso. Tarefas atribuídas foram movidas para pendente.',
        ]);
    }
}
