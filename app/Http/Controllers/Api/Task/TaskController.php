<?php

namespace App\Http\Controllers\Api\Task;

use App\Actions\Task\CreateTaskAction;
use App\Actions\Task\DeleteTaskAction;
use App\Actions\Task\UpdateTaskAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TaskController extends Controller
{
    public function index(Request $request, Workspace $workspace): AnonymousResourceCollection
    {
        $this->authorize('viewAny', [Task::class, $workspace]);

        $tasks = $workspace->tasks()
            ->with(['creator', 'assignee'])
            ->ordered()
            ->get();

        return TaskResource::collection($tasks);
    }

    public function store(
        StoreTaskRequest $request,
        Workspace $workspace,
        CreateTaskAction $action
    ): JsonResponse {
        $this->authorize('create', [Task::class, $workspace]);

        $task = $action->execute($request, $workspace, $request->user());
        $task->load(['creator', 'assignee']);

        return response()->json([
            'message' => 'Tarefa criada com sucesso.',
            'task'    => TaskResource::make($task),
        ], 201);
    }

    public function show(Request $request, Workspace $workspace, Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        $task->load(['creator', 'assignee']);

        return response()->json([
            'task' => TaskResource::make($task),
        ]);
    }

    public function update(
        UpdateTaskRequest $request,
        Workspace $workspace,
        Task $task,
        UpdateTaskAction $action
    ): JsonResponse {
        $this->authorize('update', $task);

        $task = $action->execute($request, $task);
        $task->load(['creator', 'assignee']);

        return response()->json([
            'message' => 'Tarefa atualizada com sucesso.',
            'task'    => TaskResource::make($task),
        ]);
    }

    public function destroy(
        Request $request,
        Workspace $workspace,
        Task $task,
        DeleteTaskAction $action
    ): JsonResponse {
        $this->authorize('delete', $task);

        $action->execute($task);

        return response()->json(['message' => 'Tarefa removida com sucesso.']);
    }
}
