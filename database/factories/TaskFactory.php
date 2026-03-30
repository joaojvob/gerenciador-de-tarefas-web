<?php

namespace Database\Factories;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'workspace_id' => Workspace::factory(),
            'created_by'   => User::factory(),
            'assigned_to'  => null,
            'title'        => fake()->sentence(4),
            'description'  => fake()->paragraph(),
            'priority'     => TaskPriority::Medium->value,
            'status'       => TaskStatus::Pending->value,
            'due_date'     => now()->addDays(7),
            'completed_at' => null,
            'order'        => 0,
            'metadata'     => null,
        ];
    }

    /**
     * Cria uma tarefa com status concluído.
     */
    public function completed(): static
    {
        return $this->state(fn () => [
            'status'       => TaskStatus::Completed->value,
            'completed_at' => now(),
        ]);
    }

    /**
     * Cria uma tarefa vencida (due_date no passado, não concluída).
     */
    public function overdue(): static
    {
        return $this->state(fn () => [
            'status'   => TaskStatus::Pending->value,
            'due_date' => now()->subDays(3),
        ]);
    }

    /**
     * Cria uma tarefa com prioridade urgente.
     */
    public function urgent(): static
    {
        return $this->state(fn () => ['priority' => TaskPriority::Urgent->value]);
    }
}
