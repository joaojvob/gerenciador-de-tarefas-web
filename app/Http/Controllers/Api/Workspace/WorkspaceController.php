<?php

namespace App\Http\Controllers\Api\Workspace;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use App\Http\Requests\Workspace\UpdateWorkspaceRequest;
use App\Http\Requests\Workspace\StoreWorkspaceRequest;
use App\Actions\Workspace\CreateWorkspaceAction;
use App\Http\Resources\WorkspaceResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Workspace;

class WorkspaceController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $workspaces = $request->user()
            ->workspaces()
            ->with(['owner', 'workspaceMembers.user'])
            ->withCount('tasks')
            ->get();

        return WorkspaceResource::collection($workspaces);
    }

    public function store(StoreWorkspaceRequest $request, CreateWorkspaceAction $action): JsonResponse
    {
        $workspace = $action->execute($request, $request->user());

        $workspace->load(['owner', 'workspaceMembers.user']);

        return response()->json([
            'message'   => 'Workspace criado com sucesso.',
            'workspace' => WorkspaceResource::make($workspace),
        ], 201);
    }

    public function show(Request $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('view', $workspace);

        $workspace->load(['owner', 'workspaceMembers.user', 'workspaceMembers.inviter']);
        $workspace->loadCount('tasks');

        return response()->json([
            'workspace' => WorkspaceResource::make($workspace),
        ]);
    }

    public function update(UpdateWorkspaceRequest $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('update', $workspace);

        $workspace->update($request->only(['name', 'description']));

        return response()->json([
            'message'   => 'Workspace atualizado com sucesso.',
            'workspace' => WorkspaceResource::make($workspace->fresh(['owner'])),
        ]);
    }

    public function destroy(Request $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('delete', $workspace);

        $workspace->delete();

        return response()->json(['message' => 'Workspace removido com sucesso.']);
    }
}
