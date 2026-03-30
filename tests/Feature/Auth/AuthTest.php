<?php

use App\Models\User;

// ---------------------------------------------------------------------------
// Registro
// ---------------------------------------------------------------------------

it('registra um novo usuário e retorna token', function () {
    $response = $this->postJson('/api/auth/register', [
        'name'                  => 'João Silva',
        'email'                 => 'joao@example.com',
        'password'              => 'senha123',
        'password_confirmation' => 'senha123',
    ]);

    $response->assertStatus(201)
             ->assertJsonStructure([
                 'message',
                 'token',
                 'user' => ['id', 'name', 'email'],
             ]);

    $this->assertDatabaseHas('users', ['email' => 'joao@example.com']);
});

it('cria workspace pessoal automaticamente ao registrar', function () {
    $this->postJson('/api/auth/register', [
        'name'                  => 'Maria',
        'email'                 => 'maria@example.com',
        'password'              => 'senha123',
        'password_confirmation' => 'senha123',
    ]);

    $this->assertDatabaseHas('workspaces', ['personal' => true]);
    $this->assertDatabaseHas('workspace_members', ['role' => 'owner']);
});

it('rejeita registro com e-mail já existente', function () {
    User::factory()->create(['email' => 'existente@example.com']);

    $this->postJson('/api/auth/register', [
        'name'                  => 'Outro',
        'email'                 => 'existente@example.com',
        'password'              => 'senha123',
        'password_confirmation' => 'senha123',
    ])->assertStatus(422)
      ->assertJsonValidationErrors(['email']);
});

it('rejeita registro quando senhas não coincidem', function () {
    $this->postJson('/api/auth/register', [
        'name'                  => 'João',
        'email'                 => 'joao@example.com',
        'password'              => 'senha123',
        'password_confirmation' => 'diferente',
    ])->assertStatus(422)
      ->assertJsonValidationErrors(['password']);
});

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

it('autentica usuário com credenciais corretas', function () {
    User::factory()->create([
        'email'    => 'user@example.com',
        'password' => bcrypt('senha123'),
    ]);

    $this->postJson('/api/auth/login', [
        'email'    => 'user@example.com',
        'password' => 'senha123',
    ])->assertOk()
      ->assertJsonStructure(['token', 'user']);
});

it('rejeita login com credenciais inválidas', function () {
    User::factory()->create(['email' => 'user@example.com']);

    $this->postJson('/api/auth/login', [
        'email'    => 'user@example.com',
        'password' => 'senha_errada',
    ])->assertStatus(401);
});

// ---------------------------------------------------------------------------
// Logout + Me
// ---------------------------------------------------------------------------

it('realiza logout e invalida o token', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
         ->postJson('/api/auth/logout')
         ->assertOk()
         ->assertJson(['message' => 'Logout realizado com sucesso.']);
});

it('retorna dados do usuário autenticado em /me', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
         ->getJson('/api/auth/me')
         ->assertOk()
         ->assertJsonPath('user.email', $user->email);
});

it('retorna 401 em rota protegida sem token', function () {
    $this->getJson('/api/auth/me')->assertStatus(401);
});
