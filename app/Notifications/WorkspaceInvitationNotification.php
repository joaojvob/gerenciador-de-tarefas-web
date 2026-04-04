<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Bus\Queueable;
use App\Models\Workspace;
use App\Models\User;

class WorkspaceInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Workspace $workspace,
        public User $inviter
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = config('app.frontend_url') . "/workspaces/{$this->workspace->slug}";

        return (new MailMessage)
            ->subject("Convite para o Workspace: {$this->workspace->name}")
            ->greeting("Olá, {$notifiable->name}!")
            ->line("Você foi convidado(a) por {$this->inviter->name} para participar do workspace **{$this->workspace->name}**.")
            ->action('Acessar Workspace', $frontendUrl)
            ->line('Se você não esperava por este convite, pode ignorar este e-mail.');
    }
}
