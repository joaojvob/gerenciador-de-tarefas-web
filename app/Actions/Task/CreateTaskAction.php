<?php

namespace App\Actions\Task;

use App\Enums\TaskStatus;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\Log;

class CreateTaskAction
{
    /**
     * Cria uma nova tarefa no workspace informado.
     */
    public function execute(StoreTaskRequest $request, Workspace $workspace, User $creator): Task
    {
        $task = $workspace->tasks()->create([
            'created_by'  => $creator->id,
            'assigned_to' => $request->assigned_to,
            'title'       => $request->title,
            'description' => $request->description,
            'priority'    => $request->priority ?? \App\Enums\TaskPriority::Medium->value,
            'status'      => $request->status   ?? TaskStatus::Pending->value,
            'due_date'    => $request->due_date,
            'order'       => $request->order ?? 0,
            'metadata'    => $request->metadata,
        ]);

        Log::info('Tarefa criada.', [
            'task_id'      => $task->id,
            'workspace_id' => $workspace->id,
            'created_by'   => $creator->id,
        ]);

        return $task;
    }
}
