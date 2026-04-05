<?php

namespace App\Http\Requests\Workspace;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\WorkspaceMemberRole;
use Illuminate\Validation\Rule;

class UpdateMemberRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $member = $this->route('member');

        return [
            'role' => [
                'sometimes',
                Rule::enum(WorkspaceMemberRole::class),
                Rule::notIn([WorkspaceMemberRole::Owner->value]),
            ],
            'name' => ['sometimes', 'string', 'min:2', 'max:120'],
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($member?->id),
            ],
            'permissions' => ['sometimes', 'array'],
            'permissions.can_create_tasks' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'role.enum'     => 'Papel inválido. Use: admin ou member.',
            'role.not_in'   => 'O papel owner não pode ser atribuído desta forma.',
            'name.min'      => 'O nome deve ter no mínimo 2 caracteres.',
            'email.email'   => 'Informe um e-mail válido.',
            'email.unique'  => 'Este e-mail já está em uso.',
            'permissions.array' => 'As permissões devem estar no formato de objeto.',
            'permissions.can_create_tasks.boolean' => 'A permissão de criar tarefas deve ser verdadeira ou falsa.',
        ];
    }
}
