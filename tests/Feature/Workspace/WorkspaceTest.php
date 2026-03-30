<?php

use App\Enums\WorkspaceMemberRole;
use App\Models\User;
use App\Models\Workspace;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Cria um workspace com um owner já como membro.
 */
function workspaceWithOwner(): array
{
    $owner     = User::factory()->create();
    $workspace = Workspace::factory()->withOwner($owner)->create();

    return [$owner, $workspace];
}

/**
 * Adiciona um membro a um workspace com o role informado.
 */
function addMember(Workspace $workspace, User $user, WorkspaceMemberRole $role = WorkspaceMemberRole::Member): void
{
    $workspace->workspaceMembers()->create([
        'user_id'   => $user->id,
        'role'      => $role->value,
        'joined_at' => now(),
    ]);
}

// ---------------------------------------------------------------------------
// Listagem
// ---------------------------------------------------------------------------

it('lista apenas os workspaces do usuário autenticado', function () {
    [$owner, $workspace] = workspaceWithOwner();
    Workspace::factory()->create(); // workspace de outro usuário

    $this->actingAs($owner)
         ->getJson('/api/workspaces')
         ->assertOk()
         ->assertJsonCount(1, 'data')
         ->assertJsonPath('data.0.slug', $workspace->slug);
});

// ---------------------------------------------------------------------------
// Criação
// ---------------------------------------------------------------------------

it('cria um workspace e adiciona o criador como owner', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
         ->postJson('/api/workspaces', [
             'name'        => 'Minha Empresa',
             'description' => 'Workspace de testes',
         ])
         ->assertStatus(201)
         ->assertJsonPath('workspace.name', 'Minha Empresa');

    $this->assertDatabaseHas('workspaces', ['name' => 'Minha Empresa']);
    $this->assertDatabaseHas('workspace_members', [
        'user_id' => $user->id,
        'role'    => 'owner',
    ]);
});

it('rejeita criação sem nome', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
         ->postJson('/api/workspaces', [])
         ->assertStatus(422)
         ->assertJsonValidationErrors(['name']);
});

// ---------------------------------------------------------------------------
// Exibição
// ---------------------------------------------------------------------------

it('membro pode visualizar o workspace', function () {
    [$owner, $workspace] = workspaceWithOwner();
    $member = User::factory()->create();
    addMember($workspace, $member);

    $this->actingAs($member)
         ->getJson("/api/workspaces/{$workspace->slug}")
         ->assertOk()
         ->assertJsonPath('workspace.slug', $workspace->slug);
});

it('não-membro não pode visualizar o workspace', function () {
    [, $workspace] = workspaceWithOwner();
    $outsider = User::factory()->create();

    $this->actingAs($outsider)
         ->getJson("/api/workspaces/{$workspace->slug}")
         ->assertStatus(403);
});

// ---------------------------------------------------------------------------
// Atualização
// ---------------------------------------------------------------------------

it('owner pode atualizar o workspace', function () {
    [$owner, $workspace] = workspaceWithOwner();

    $this->actingAs($owner)
         ->patchJson("/api/workspaces/{$workspace->slug}", ['name' => 'Novo Nome'])
         ->assertOk()
         ->assertJsonPath('workspace.name', 'Novo Nome');
});

it('membro comum não pode atualizar o workspace', function () {
    [$owner, $workspace] = workspaceWithOwner();
    $member = User::factory()->create();
    addMember($workspace, $member);

    $this->actingAs($member)
         ->patchJson("/api/workspaces/{$workspace->slug}", ['name' => 'Tentativa'])
         ->assertStatus(403);
});

// ---------------------------------------------------------------------------
// Remoção
// ---------------------------------------------------------------------------

it('owner pode remover o workspace', function () {
    [$owner, $workspace] = workspaceWithOwner();

    $this->actingAs($owner)
         ->deleteJson("/api/workspaces/{$workspace->slug}")
         ->assertOk();

    $this->assertSoftDeleted('workspaces', ['id' => $workspace->id]);
});

it('workspace pessoal não pode ser removido', function () {
    $owner     = User::factory()->create();
    $workspace = Workspace::factory()->personal()->withOwner($owner)->create();

    $this->actingAs($owner)
         ->deleteJson("/api/workspaces/{$workspace->slug}")
         ->assertStatus(403);
});
