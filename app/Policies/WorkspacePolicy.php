<?php

namespace App\Policies;

use App\Enums\WorkspaceMemberRole;
use App\Models\User;
use App\Models\Workspace;

class WorkspacePolicy
{
    /**
     * Qualquer usuário autenticado pode listar seus próprios workspaces.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Somente membros do workspace podem visualizá-lo.
     */
    public function view(User $user, Workspace $workspace): bool
    {
        return $workspace->hasMember($user);
    }

    /**
     * Qualquer usuário autenticado pode criar um workspace.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Somente owner ou admin podem atualizar o workspace.
     */
    public function update(User $user, Workspace $workspace): bool
    {
        $role = $user->roleIn($workspace);

        return $role?->isAtLeast(WorkspaceMemberRole::Admin) ?? false;
    }

    /**
     * Somente o owner pode excluir o workspace.
     * Workspaces pessoais nunca podem ser excluídos.
     */
    public function delete(User $user, Workspace $workspace): bool
    {
        if ($workspace->personal) {
            return false;
        }

        return $workspace->owner_id === $user->id;
    }

    /**
     * Somente owner ou admin podem convidar novos membros.
     */
    public function inviteMember(User $user, Workspace $workspace): bool
    {
        $role = $user->roleIn($workspace);

        return $role?->isAtLeast(WorkspaceMemberRole::Admin) ?? false;
    }

    /**
     * Somente owner ou admin podem alterar o papel de um membro.
     * Owner não pode ter seu papel alterado.
     */
    public function updateMemberRole(User $user, Workspace $workspace): bool
    {
        $role = $user->roleIn($workspace);

        return $role?->isAtLeast(WorkspaceMemberRole::Admin) ?? false;
    }

    /**
     * Somente owner ou admin podem remover membros.
     * Um usuário pode remover a si mesmo (saída voluntária).
     */
    public function removeMember(User $user, Workspace $workspace, User $target): bool
    {
        if ($user->id === $target->id) {
            return true;
        }

        $role = $user->roleIn($workspace);

        return $role?->isAtLeast(WorkspaceMemberRole::Admin) ?? false;
    }
}
