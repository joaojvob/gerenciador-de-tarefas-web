<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Bus\Queueable;
use App\Models\Task;

class TaskDueSoonNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Task $task
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = config('app.frontend_url') . "/workspaces/{$this->task->workspace->slug}/tasks/{$this->task->id}";
        $dueDate     = $this->task->due_date?->format('d/m/Y H:i');

        return (new MailMessage)
            ->subject("Atenção: A tarefa '{$this->task->title}' vence em breve")
            ->greeting("Olá, {$notifiable->name}!")
            ->line("Você foi atribuído(a) à tarefa **{$this->task->title}**, que está marcada para vencer em **{$dueDate}**.")
            ->action('Visualizar Tarefa', $frontendUrl)
            ->line('Por favor, verifique o andamento para evitar atrasos no cronograma do seu workspace.');
    }
}
