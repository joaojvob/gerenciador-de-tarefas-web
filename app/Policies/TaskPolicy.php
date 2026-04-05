<?php

namespace App\Policies;

use App\Enums\WorkspaceMemberRole;
use App\Models\Workspace;
use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Intercepta verificações globais para Super Admins.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->is_super_admin) {
            return true;
        }

        return null;
    }

    /**
     * Somente membros do workspace podem listar as tarefas.
     */
    public function viewAny(User $user, Workspace $workspace): bool
    {
        return $workspace->hasMember($user);
    }

    /**
     * Somente membros do workspace podem visualizar uma tarefa.
     */
    public function view(User $user, Task $task): bool
    {
        return $task->workspace->hasMember($user);
    }

    /**
     * Somente membros do workspace podem criar tarefas.
     */
    public function create(User $user, Workspace $workspace): bool
    {
        return $user->canCreateTasksIn($workspace);
    }

    /**
     * O criador da tarefa, o responsável, ou um admin/owner do workspace pode atualizar.
     */
    public function update(User $user, Task $task): bool
    {
        if ($task->created_by === $user->id || $task->assigned_to === $user->id) {
            return true;
        }

        $role = $user->roleIn($task->workspace);

        return $role?->isAtLeast(WorkspaceMemberRole::Admin) ?? false;
    }

    /**
     * Somente o criador da tarefa ou um admin/owner do workspace pode excluí-la.
     */
    public function delete(User $user, Task $task): bool
    {
        if ($task->created_by === $user->id) {
            return true;
        }

        $role = $user->roleIn($task->workspace);

        return $role?->isAtLeast(WorkspaceMemberRole::Admin) ?? false;
    }
}
