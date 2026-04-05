<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'avatar_url' => $this->avatar_url,
            'is_super_admin' => (bool) $this->is_super_admin,
            'is_workspace_manager' => $this->isWorkspaceManager(),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
