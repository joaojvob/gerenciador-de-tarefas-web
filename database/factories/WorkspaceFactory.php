<?php

namespace Database\Factories;

use App\Enums\WorkspaceMemberRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Workspace>
 */
class WorkspaceFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->company();

        return [
            'name'        => $name,
            'slug'        => Str::slug($name) . '-' . Str::random(4),
            'description' => fake()->sentence(),
            'owner_id'    => User::factory(),
            'personal'    => false,
            'settings'    => null,
        ];
    }

    /**
     * Cria um workspace do tipo pessoal.
     */
    public function personal(): static
    {
        return $this->state(fn () => ['personal' => true]);
    }

    /**
     * Cria o workspace já com o owner como membro.
     */
    public function withOwner(User $owner): static
    {
        return $this->state(fn () => ['owner_id' => $owner->id])
                    ->afterCreating(function ($workspace) use ($owner) {
                        $workspace->workspaceMembers()->create([
                            'user_id'   => $owner->id,
                            'role'      => WorkspaceMemberRole::Owner->value,
                            'joined_at' => now(),
                        ]);
                    });
    }
}
