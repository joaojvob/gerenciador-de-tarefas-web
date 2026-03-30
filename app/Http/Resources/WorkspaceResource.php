<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'slug'        => $this->slug,
            'description' => $this->description,
            'personal'    => $this->personal,
            'owner'       => UserResource::make($this->whenLoaded('owner')),
            'members'     => WorkspaceMemberResource::collection($this->whenLoaded('workspaceMembers')),
            'tasks_count' => $this->whenCounted('tasks'),
            'created_at'  => $this->created_at->toISOString(),
        ];
    }
}
