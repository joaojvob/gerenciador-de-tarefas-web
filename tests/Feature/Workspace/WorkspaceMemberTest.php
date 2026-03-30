<?php

use App\Enums\WorkspaceMemberRole;
use App\Models\User;
use App\Models\Workspace;

// ---------------------------------------------------------------------------
// Listagem de membros
// ---------------------------------------------------------------------------

it('admin pode listar membros do workspace', function () {
    $owner     = User::factory()->create();
    $workspace = Workspace::factory()->withOwner($owner)->create();

    $this->actingAs($owner)
         ->getJson("/api/workspaces/{$workspace->slug}/members")
         ->assertOk()
         ->assertJsonCount(1, 'data');
});

// ---------------------------------------------------------------------------
// Convite de membros
// ---------------------------------------------------------------------------

it('admin pode convidar um novo membro', function () {
    $owner     = User::factory()->create();
    $workspace = Workspace::factory()->withOwner($owner)->create();
    $invitee   = User::factory()->create();

    $this->actingAs($owner)
         ->postJson("/api/workspaces/{$workspace->slug}/members", [
             'email' => $invitee->email,
         ])
         ->assertStatus(201)
         ->assertJsonPath('member.role', WorkspaceMemberRole::Member->value);

    $this->assertDatabaseHas('workspace_members', [
        'workspace_id' => $workspace->id,
        'user_id'      => $invitee->id,
    ]);
});

it('membro comum não pode convidar outros membros', function () {
    $owner     = User::factory()->create();
    $workspace = Workspace::factory()->withOwner($owner)->create();
    $member    = User::factory()->create();
    $invitee   = User::factory()->create();

    $workspace->workspaceMembers()->create([
        'user_id'   => $member->id,
        'role'      => WorkspaceMemberRole::Member->value,
        'joined_at' => now(),
    ]);

    $this->actingAs($member)
         ->postJson("/api/workspaces/{$workspace->slug}/members", [
             'email' => $invitee->email,
         ])
         ->assertStatus(403);
});

it('rejeita convite de e-mail não cadastrado', function () {
    $owner     = User::factory()->create();
    $workspace = Workspace::factory()->withOwner($owner)->create();

    $this->actingAs($owner)
         ->postJson("/api/workspaces/{$workspace->slug}/members", [
             'email' => 'inexistente@example.com',
         ])
         ->assertStatus(422)
         ->assertJsonValidationErrors(['email']);
});

it('rejeita convite de usuário já membro', function () {
    $owner     = User::factory()->create();
    $workspace = Workspace::factory()->withOwner($owner)->create();

    $this->actingAs($owner)
         ->postJson("/api/workspaces/{$workspace->slug}/members", [
             'email' => $owner->email,
         ])
         ->assertStatus(422)
         ->assertJsonValidationErrors(['email']);
});

// ---------------------------------------------------------------------------
// Alteração de role
// ---------------------------------------------------------------------------

it('owner pode promover membro para admin', function () {
    $owner     = User::factory()->create();
    $workspace = Workspace::factory()->withOwner($owner)->create();
    $member    = User::factory()->create();

    $workspace->workspaceMembers()->create([
        'user_id'   => $member->id,
        'role'      => WorkspaceMemberRole::Member->value,
        'joined_at' => now(),
    ]);

    $this->actingAs($owner)
         ->patchJson("/api/workspaces/{$workspace->slug}/members/{$member->id}", [
             'role' => WorkspaceMemberRole::Admin->value,
         ])
         ->assertOk()
         ->assertJsonPath('member.role', 'admin');
});

it('não é possível atribuir role owner via api', function () {
    $owner     = User::factory()->create();
    $workspace = Workspace::factory()->withOwner($owner)->create();
    $member    = User::factory()->create();

    $workspace->workspaceMembers()->create([
        'user_id'   => $member->id,
        'role'      => WorkspaceMemberRole::Member->value,
        'joined_at' => now(),
    ]);

    $this->actingAs($owner)
         ->patchJson("/api/workspaces/{$workspace->slug}/members/{$member->id}", [
             'role' => WorkspaceMemberRole::Owner->value,
         ])
         ->assertStatus(422);
});

// ---------------------------------------------------------------------------
// Remoção de membros
// ---------------------------------------------------------------------------

it('owner pode remover um membro', function () {
    $owner     = User::factory()->create();
    $workspace = Workspace::factory()->withOwner($owner)->create();
    $member    = User::factory()->create();

    $workspace->workspaceMembers()->create([
        'user_id'   => $member->id,
        'role'      => WorkspaceMemberRole::Member->value,
        'joined_at' => now(),
    ]);

    $this->actingAs($owner)
         ->deleteJson("/api/workspaces/{$workspace->slug}/members/{$member->id}")
         ->assertOk();

    $this->assertDatabaseMissing('workspace_members', [
        'workspace_id' => $workspace->id,
        'user_id'      => $member->id,
    ]);
});

it('usuário pode remover a si mesmo do workspace', function () {
    $owner     = User::factory()->create();
    $workspace = Workspace::factory()->withOwner($owner)->create();
    $member    = User::factory()->create();

    $workspace->workspaceMembers()->create([
        'user_id'   => $member->id,
        'role'      => WorkspaceMemberRole::Member->value,
        'joined_at' => now(),
    ]);

    $this->actingAs($member)
         ->deleteJson("/api/workspaces/{$workspace->slug}/members/{$member->id}")
         ->assertOk();
});
