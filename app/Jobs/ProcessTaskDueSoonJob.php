<?php

namespace App\Jobs;

use App\Notifications\TaskDueSoonNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Bus\Queueable;
use App\Enums\TaskStatus;
use App\Models\Task;

class ProcessTaskDueSoonJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        Log::info('Iniciando processamento de tarefas a vencer...');

        $now = now();
        $limit = now()->addHours(24);

        $tasks = Task::with('assignee')
            ->whereNotNull('assigned_to')
            ->where('status', '!=', TaskStatus::Completed->value)
            ->whereNotNull('due_date')
            ->whereBetween('due_date', [$now, $limit])
            ->get();

        $count = $tasks->count();

        foreach ($tasks as $task) {
            if ($task->assignee) {
                $task->assignee->notify(new TaskDueSoonNotification($task));
            }
        }

        Log::info('Processamento concluído.', ['tarefas_notificadas' => $count]);
    }
}
