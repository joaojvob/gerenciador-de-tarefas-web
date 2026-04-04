<?php

namespace App\Actions\Task;

use App\Enums\TaskPriority;
use App\Http\Requests\Task\StoreTaskRequest;
use Illuminate\Support\Facades\Log;
use App\Models\Workspace;
use App\Enums\TaskStatus;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateTaskAction
{
    /**
     * Cria uma nova tarefa no workspace informado.
     */
    public function execute(StoreTaskRequest $request, Workspace $workspace, User $creator): Task
    {
        try {
            DB::beginTransaction();

            $task = $workspace->tasks()->create([
                'created_by'  => $creator->id,
                'assigned_to' => $request->assigned_to,
                'title'       => $request->title,
                'description' => $request->description,
                'priority'    => $request->priority ?? TaskPriority::Medium->value,
                'status'      => $request->status   ?? TaskStatus::Pending->value,
                'due_date'    => $request->due_date,
                'order'       => $request->order ?? 0,
                'metadata'    => $request->metadata,
            ]);

            DB::commit();

            Log::info('Tarefa criada.', [
                'task_id'      => $task->id,
                'workspace_id' => $workspace->id,
                'created_by'   => $creator->id,
            ]);

            return $task;
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Erro ao criar tarefa!', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }
}
