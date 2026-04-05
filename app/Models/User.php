<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use App\Enums\WorkspaceMemberRole;
use App\Models\WorkspaceMember;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar_url',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }


    /**
     * Workspaces dos quais o usuário é proprietário.
     */
    public function ownedWorkspaces(): HasMany
    {
        return $this->hasMany(Workspace::class, 'owner_id');
    }

    /**
     * Todos os workspaces dos quais o usuário é membro (incluindo os que possui).
     */
    public function workspaces(): BelongsToMany
    {
        return $this->belongsToMany(Workspace::class, 'workspace_members')
            ->using(WorkspaceMember::class)
            ->withPivot('role', 'permissions', 'invited_by', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Tarefas criadas pelo usuário.
     */
    public function createdTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'created_by');
    }

    /**
     * Tarefas atribuídas ao usuário.
     */
    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    /**
     * Retorna o papel do usuário em um workspace específico.
     */
    public function roleIn(Workspace $workspace): ?WorkspaceMemberRole
    {
        $member = $this->workspaces()
            ->where('workspace_id', $workspace->id)
            ->first();

        if (! $member) {
            return null;
        }

        $pivotRole = $member->pivot->role;

        if ($pivotRole instanceof WorkspaceMemberRole) {
            return $pivotRole;
        }

        return WorkspaceMemberRole::from($pivotRole);
    }

    /**
     * Verifica se o usuário pertence a um workspace.
     */
    public function isMemberOf(Workspace $workspace): bool
    {
        return $this->workspaces()->where('workspace_id', $workspace->id)->exists();
    }

    /**
     * Retorna o registro de membro em um workspace específico.
     */
    public function workspaceMemberIn(Workspace $workspace): ?WorkspaceMember
    {
        return WorkspaceMember::query()
            ->where('workspace_id', $workspace->id)
            ->where('user_id', $this->id)
            ->first();
    }

    /**
     * Verifica se o usuário pode criar tarefas no workspace.
     */
    public function canCreateTasksIn(Workspace $workspace): bool
    {
        $member = $this->workspaceMemberIn($workspace);

        if (! $member) {
            return false;
        }

        return $member->hasPermission('can_create_tasks');
    }

    /**
     * Verifica se o usuário atua como gestor em algum workspace.
     */
    public function isWorkspaceManager(): bool
    {
        if ($this->is_super_admin) {
            return true;
        }

        return WorkspaceMember::query()
            ->where('user_id', $this->id)
            ->whereIn('role', [
                WorkspaceMemberRole::Owner->value,
                WorkspaceMemberRole::Admin->value,
            ])
            ->exists();
    }
}
