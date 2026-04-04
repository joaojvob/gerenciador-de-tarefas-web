<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\WorkspaceMemberRole;
use Illuminate\Validation\Rule;
use App\Enums\TaskPriority;
use App\Enums\TaskStatus;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'title'       => ['sometimes', 'string', 'min:2', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'priority'    => ['nullable', Rule::enum(TaskPriority::class)],
            'status'      => ['nullable', Rule::enum(TaskStatus::class)],
            'due_date'    => ['nullable', 'date'],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
            'order'       => ['nullable', 'integer', 'min:0'],
            'metadata'    => ['nullable', 'array'],
        ];

        $user = $this->user();
        $task = $this->route('task');

        if ($user->is_super_admin) {
            return $rules;
        }

        $role      = $user->roleIn($task->workspace);
        $isManager = $role?->isAtLeast(WorkspaceMemberRole::Admin);
        $isCreator = $task->created_by === $user->id;

        // Se for um "Membro" simples e não foi o criador, ele só pode alterar o Status
        if (!$isManager && !$isCreator) {
            return [
                'status' => ['required', Rule::enum(TaskStatus::class)],
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'title.min'          => 'O título deve ter ao menos 2 caracteres.',
            'due_date.date'      => 'Data de vencimento inválida.',
            'assigned_to.exists' => 'O usuário informado não existe.',
            'priority.enum'      => 'Prioridade inválida.',
            'status.enum'        => 'Status inválido.',
        ];
    }
}
