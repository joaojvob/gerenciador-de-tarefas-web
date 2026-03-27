<?php

namespace App\Models;

use App\Enums\WorkspaceMemberRole;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class WorkspaceMember extends Pivot
{
    protected $table = 'workspace_members';

    public $incrementing = true;

    protected $fillable = [
        'workspace_id',
        'user_id',
        'role',
        'invited_by',
        'joined_at',
    ];

    protected function casts(): array
    {
        return [
            'role'      => WorkspaceMemberRole::class,
            'joined_at' => 'datetime',
        ];
    }

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

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
}
