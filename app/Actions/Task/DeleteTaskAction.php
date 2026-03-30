<?php

namespace App\Actions\Task;

use App\Models\Task;
use Illuminate\Support\Facades\Log;

class DeleteTaskAction
{
    /**
     * Realiza soft delete de uma tarefa.
     */
    public function execute(Task $task): void
    {
        $task->delete();

        Log::info('Tarefa removida (soft delete).', [
            'task_id'      => $task->id,
            'workspace_id' => $task->workspace_id,
        ]);
    }
}
