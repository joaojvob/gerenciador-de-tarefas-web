<?php

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/**
 * Cria workspace com owner e retorna ambos.
 */
function setupWorkspace(): array
{
    $owner     = User::factory()->create();
    $workspace = Workspace::factory()->withOwner($owner)->create();

    return [$owner, $workspace];
}

// ---------------------------------------------------------------------------
// Listagem
// ---------------------------------------------------------------------------

it('membro pode listar tarefas do workspace', function () {
    [$owner, $workspace] = setupWorkspace();

    Task::factory()->count(3)->create([
        'workspace_id' => $workspace->id,
        'created_by'   => $owner->id,
    ]);

    $this->actingAs($owner)
         ->getJson("/api/workspaces/{$workspace->slug}/tasks")
         ->assertOk()
         ->assertJsonCount(3, 'data');
});

it('não-membro não pode listar tarefas', function () {
    [, $workspace] = setupWorkspace();
    $outsider = User::factory()->create();

    $this->actingAs($outsider)
         ->getJson("/api/workspaces/{$workspace->slug}/tasks")
         ->assertStatus(403);
});

// ---------------------------------------------------------------------------
// Criação
// ---------------------------------------------------------------------------

it('membro pode criar uma tarefa no workspace', function () {
    [$owner, $workspace] = setupWorkspace();

    $this->actingAs($owner)
         ->postJson("/api/workspaces/{$workspace->slug}/tasks", [
             'title'    => 'Nova Tarefa',
             'priority' => TaskPriority::High->value,
         ])
         ->assertStatus(201)
         ->assertJsonPath('task.title', 'Nova Tarefa')
         ->assertJsonPath('task.priority', TaskPriority::High->value);

    $this->assertDatabaseHas('tasks', [
        'workspace_id' => $workspace->id,
        'title'        => 'Nova Tarefa',
        'created_by'   => $owner->id,
    ]);
});

it('rejeita criação de tarefa sem título', function () {
    [$owner, $workspace] = setupWorkspace();

    $this->actingAs($owner)
         ->postJson("/api/workspaces/{$workspace->slug}/tasks", [])
         ->assertStatus(422)
         ->assertJsonValidationErrors(['title']);
});

it('rejeita due_date no passado ao criar tarefa', function () {
    [$owner, $workspace] = setupWorkspace();

    $this->actingAs($owner)
         ->postJson("/api/workspaces/{$workspace->slug}/tasks", [
             'title'    => 'Tarefa',
             'due_date' => now()->subDay()->toDateTimeString(),
         ])
         ->assertStatus(422)
         ->assertJsonValidationErrors(['due_date']);
});

// ---------------------------------------------------------------------------
// Atualização
// ---------------------------------------------------------------------------

it('atualização para status concluído preenche completed_at', function () {
    [$owner, $workspace] = setupWorkspace();

    $task = Task::factory()->create([
        'workspace_id' => $workspace->id,
        'created_by'   => $owner->id,
    ]);

    $this->actingAs($owner)
         ->patchJson("/api/workspaces/{$workspace->slug}/tasks/{$task->id}", [
             'status' => TaskStatus::Completed->value,
         ])
         ->assertOk()
         ->assertJsonPath('task.status', TaskStatus::Completed->value);

    $this->assertDatabaseHas('tasks', [
        'id'     => $task->id,
        'status' => TaskStatus::Completed->value,
    ]);

    expect(Task::find($task->id)->completed_at)->not->toBeNull();
});

it('reabertura da tarefa limpa o completed_at', function () {
    [$owner, $workspace] = setupWorkspace();

    $task = Task::factory()->completed()->create([
        'workspace_id' => $workspace->id,
        'created_by'   => $owner->id,
    ]);

    $this->actingAs($owner)
         ->patchJson("/api/workspaces/{$workspace->slug}/tasks/{$task->id}", [
             'status' => TaskStatus::Pending->value,
         ])
         ->assertOk();

    expect(Task::find($task->id)->completed_at)->toBeNull();
});

it('não-membro não pode atualizar tarefa', function () {
    [, $workspace] = setupWorkspace();
    $outsider = User::factory()->create();
    $creator  = User::factory()->create();

    $task = Task::factory()->create([
        'workspace_id' => $workspace->id,
        'created_by'   => $creator->id,
    ]);

    $this->actingAs($outsider)
         ->patchJson("/api/workspaces/{$workspace->slug}/tasks/{$task->id}", [
             'title' => 'Tentativa',
         ])
         ->assertStatus(403);
});

// ---------------------------------------------------------------------------
// Remoção
// ---------------------------------------------------------------------------

it('criador pode remover sua própria tarefa (soft delete)', function () {
    [$owner, $workspace] = setupWorkspace();

    $task = Task::factory()->create([
        'workspace_id' => $workspace->id,
        'created_by'   => $owner->id,
    ]);

    $this->actingAs($owner)
         ->deleteJson("/api/workspaces/{$workspace->slug}/tasks/{$task->id}")
         ->assertOk();

    $this->assertSoftDeleted('tasks', ['id' => $task->id]);
});

it('não pode visualizar tarefa que não pertence ao workspace', function () {
    [$owner, $workspace] = setupWorkspace();

    $otherTask = Task::factory()->create(); // pertence a outro workspace

    $this->actingAs($owner)
         ->getJson("/api/workspaces/{$workspace->slug}/tasks/{$otherTask->id}")
         ->assertStatus(404);
});
