<?php

namespace App\Actions\Task;

use App\Enums\TaskStatus;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Support\Facades\Log;

class UpdateTaskAction
{
    /**
     * Atualiza os dados de uma tarefa existente.
     *
     * Gerencia automaticamente o campo `completed_at` com base na mudança de status.
     */
    public function execute(UpdateTaskRequest $request, Task $task): Task
    {
        $data = $request->only([
            'title', 'description', 'priority',
            'status', 'due_date', 'assigned_to',
            'order', 'metadata',
        ]);

        if (isset($data['status'])) {
            $data['completed_at'] = ($data['status'] === TaskStatus::Completed->value)
                ? now()
                : null;
        }

        $task->update($data);

        Log::info('Tarefa atualizada.', [
            'task_id' => $task->id,
            'changes' => array_keys($data),
        ]);

        return $task->fresh();
    }
}
