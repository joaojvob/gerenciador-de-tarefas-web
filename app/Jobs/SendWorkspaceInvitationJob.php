<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Workspace;
use App\Notifications\WorkspaceInvitationNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendWorkspaceInvitationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Workspace $workspace,
        public User $invitee,
        public User $inviter
    ) {}

    public function handle(): void
    {
        Log::info('Enviando e-mail de convite.', [
            'workspace_id' => $this->workspace->id,
            'user_id'      => $this->invitee->id,
        ]);

        $this->invitee->notify(new WorkspaceInvitationNotification($this->workspace, $this->inviter));
    }
}
