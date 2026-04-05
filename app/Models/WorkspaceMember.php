<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use App\Enums\WorkspaceMemberRole;

class WorkspaceMember extends Pivot
{
    protected $table = 'workspace_members';

    public $incrementing = true;

    protected $fillable = [
        'workspace_id',
        'user_id',
        'role',
        'permissions',
        'invited_by',
        'joined_at',
    ];

    protected function casts(): array
    {
        return [
            'role'      => WorkspaceMemberRole::class,
            'permissions' => 'array',
            'joined_at' => 'datetime',
        ];
    }

    /**
     * Usuário membro.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Workspace ao qual o membro pertence.
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    /**
     * Usuário que enviou o convite.
     */
    public function inviter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    /**
     * Verifica se o membro aceitou o convite (joined_at preenchido).
     */
    public function hasJoined(): bool
    {
        return $this->joined_at !== null;
    }

    /**
     * Verifica se este membro possui papel igual ou superior ao informado.
     */
    public function isAtLeast(WorkspaceMemberRole $role): bool
    {
        return $this->role->isAtLeast($role);
    }

    /**
     * Verifica uma permissão granular do membro.
     */
    public function hasPermission(string $key): bool
    {
        if ($this->role->isAtLeast(WorkspaceMemberRole::Admin)) {
            return true;
        }

        return (bool) data_get($this->permissions ?? [], $key, false);
    }

    /**
     * Retorna permissões normalizadas para consumo da API.
     */
    public function normalizedPermissions(): array
    {
        return [
            'can_create_tasks' => $this->hasPermission('can_create_tasks'),
        ];
    }
}
