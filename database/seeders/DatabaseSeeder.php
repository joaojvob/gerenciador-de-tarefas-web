<?php

namespace Database\Seeders;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Enums\WorkspaceMemberRole;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Criar Super Admin
        $superAdmin = User::create([
            'name'           => 'Super Administrador',
            'email'          => 'superadmin@admin.com',
            'password'       => bcrypt('versa@123'),
            'is_super_admin' => true,
        ]);

        // 2. Criar Gestor Principal e Usuários Múltiplos
        $gestor = User::create([
            'name'     => 'João Gestor',
            'email'    => 'joao@empresa.com',
            'password' => bcrypt('versa@123'),
        ]);

        $worker1 = User::create(['name' => 'Alice Trabalhadora', 'email' => 'alice@empresa.com', 'password' => bcrypt('versa@123')]);
        $worker2 = User::create(['name' => 'Bob Designer', 'email' => 'bob@empresa.com', 'password' => bcrypt('versa@123')]);
        $worker3 = User::create(['name' => 'Carlos Tech', 'email' => 'carlos@tech.com', 'password' => bcrypt('versa@123')]);

        // 3. Criar Tenants (Workspaces)
        $workspacesData = [
            ['name' => 'Empresa Matrix Premium', 'plan' => 'premium'],
            ['name' => 'Startup Free Tier', 'plan' => 'free'],
            ['name' => 'Tech Corp Pessoal', 'plan' => 'free'],
        ];

        foreach ($workspacesData as $idx => $data) {
            $workspace = Workspace::create([
                'name'     => $data['name'],
                'slug'     => Str::slug($data['name']) . '-' . rand(100, 999),
                'owner_id' => $gestor->id,
                'plan'     => $data['plan'],
            ]);

            // Adicionar o dono na pivot
            $workspace->members()->attach($gestor->id, ['role' => WorkspaceMemberRole::Owner]);

            // Workspace 0 (Premium) tem Alice (Admin) e Bob (Member)
            if ($idx === 0) {
                $workspace->members()->attach($worker1->id, ['role' => WorkspaceMemberRole::Admin]);
                $workspace->members()->attach($worker2->id, ['role' => WorkspaceMemberRole::Member]);
            }
            // Workspace 1 (Free) tem Carlos e Bob (ambos Members)
            if ($idx === 1) {
                $workspace->members()->attach($worker3->id, ['role' => WorkspaceMemberRole::Member]);
                $workspace->members()->attach($worker2->id, ['role' => WorkspaceMemberRole::Member]);
            }

            // Mapeamento Status e Priority
            $statuses = TaskStatus::cases();
            $priorities = TaskPriority::cases();

            // 4. Criar Tarefas Simples Distribuídas
            for ($i = 0; $i < 5; $i++) {
                $status = $statuses[array_rand($statuses)];
                
                // Distribuição de Assinees
                $assigneeId = null;
                if ($status !== TaskStatus::Backlog) {
                    $membrosPivotIds = $workspace->members()->pluck('users.id')->toArray();
                    $assigneeId = $membrosPivotIds[array_rand($membrosPivotIds)];
                }

                Task::create([
                    'workspace_id' => $workspace->id,
                    'created_by'   => $gestor->id,
                    'assigned_to'  => $assigneeId,
                    'title'        => "Tarefa de demonstração #" . ($i + 1) . " - " . $workspace->name,
                    'description'  => "Descrição gerada automaticamente para a tarefa " . ($i + 1),
                    'status'       => $status,
                    'priority'     => $priorities[array_rand($priorities)],
                ]);
            }
        }
    }
}
