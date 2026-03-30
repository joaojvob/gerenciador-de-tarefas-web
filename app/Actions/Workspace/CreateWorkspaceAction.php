<?php

namespace App\Actions\Workspace;

use App\Enums\WorkspaceMemberRole;
use App\Http\Requests\Workspace\StoreWorkspaceRequest;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CreateWorkspaceAction
{
    /**
     * Cria um novo workspace e adiciona o criador como owner.
     */
    public function execute(StoreWorkspaceRequest $request, User $owner): Workspace
    {
        $slug = $this->generateUniqueSlug($request->name);

        $workspace = Workspace::create([
            'name'        => $request->name,
            'slug'        => $slug,
            'description' => $request->description,
            'owner_id'    => $owner->id,
            'personal'    => false,
        ]);

        $workspace->workspaceMembers()->create([
            'user_id'   => $owner->id,
            'role'      => WorkspaceMemberRole::Owner->value,
            'joined_at' => now(),
        ]);

        Log::info('Workspace criado.', [
            'workspace_id' => $workspace->id,
            'slug'         => $workspace->slug,
            'owner_id'     => $owner->id,
        ]);

        return $workspace;
    }

    /**
     * Gera um slug único, adicionando sufixo numérico se necessário.
     */
    private function generateUniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i    = 1;

        while (Workspace::withTrashed()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
