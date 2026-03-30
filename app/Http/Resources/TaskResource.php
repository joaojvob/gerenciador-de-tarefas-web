<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'description'    => $this->description,
            'priority'       => $this->priority->value,
            'priority_label' => $this->priority->label(),
            'priority_color' => $this->priority->color(),
            'status'         => $this->status->value,
            'status_label'   => $this->status->label(),
            'status_color'   => $this->status->color(),
            'due_date'       => $this->due_date?->toISOString(),
            'completed_at'   => $this->completed_at?->toISOString(),
            'is_overdue'     => $this->isOverdue(),
            'order'          => $this->order,
            'metadata'       => $this->metadata,
            'workspace_id'   => $this->workspace_id,
            'creator'        => UserResource::make($this->whenLoaded('creator')),
            'assignee'       => UserResource::make($this->whenLoaded('assignee')),
            'created_at'     => $this->created_at->toISOString(),
            'updated_at'     => $this->updated_at->toISOString(),
        ];
    }
}
