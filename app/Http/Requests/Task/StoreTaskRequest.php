<?php

namespace App\Http\Requests\Task;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'min:2', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'priority'    => ['nullable', Rule::enum(TaskPriority::class)],
            'status'      => ['nullable', Rule::enum(TaskStatus::class)],
            'due_date'    => ['nullable', 'date', 'after:now'],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
            'order'       => ['nullable', 'integer', 'min:0'],
            'metadata'    => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'  => 'O título da tarefa é obrigatório.',
            'title.min'       => 'O título deve ter ao menos 2 caracteres.',
            'due_date.date'   => 'Data de vencimento inválida.',
            'due_date.after'  => 'A data de vencimento deve ser no futuro.',
            'assigned_to.exists' => 'O usuário informado não existe.',
            'priority.enum'   => 'Prioridade inválida.',
            'status.enum'     => 'Status inválido.',
        ];
    }
}
