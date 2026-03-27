<?php

namespace App\Models;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'workspace_id',
        'created_by',
        'assigned_to',
        'title',
        'description',
        'priority',
        'status',
        'due_date',
        'completed_at',
        'order',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'priority'     => TaskPriority::class,
            'status'       => TaskStatus::class,
            'due_date'     => 'datetime',
            'completed_at' => 'datetime',
            'metadata'     => 'array',
        ];
    }

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    /**
     * Workspace ao qual a tarefa pertence.
     */
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    /**
     * Usuário que criou a tarefa.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Usuário responsável pela tarefa.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    /**
     * Filtra tarefas pelo status informado.
     */
    public function scopeWithStatus($query, TaskStatus $status)
    {
        return $query->where('status', $status->value);
    }

    /**
     * Filtra tarefas pela prioridade informada.
     */
    public function scopeWithPriority($query, TaskPriority $priority)
    {
        return $query->where('priority', $priority->value);
    }

    /**
     * Filtra tarefas atribuídas a um usuário específico.
     */
    public function scopeAssignedTo($query, int $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    /**
     * Ordena tarefas pela coluna `order` de forma ascendente.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Verifica se a tarefa está concluída.
     */
    public function isCompleted(): bool
    {
        return $this->status === TaskStatus::Completed;
    }

    /**
     * Verifica se a tarefa está vencida (não concluída e com due_date no passado).
     */
    public function isOverdue(): bool
    {
        return ! $this->isCompleted()
            && $this->due_date !== null
            && $this->due_date->isPast();
    }
}
