<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'user'       => UserResource::make($this->whenLoaded('user')),
            'role'       => $this->role->value,
            'role_label' => $this->role->label(),
            'permissions' => $this->normalizedPermissions(),
            'invited_by' => UserResource::make($this->whenLoaded('inviter')),
            'joined_at'  => $this->joined_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
