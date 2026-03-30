<?php

namespace App\Http\Requests\Workspace;

use App\Enums\WorkspaceMemberRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMemberRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'role' => [
                'required',
                Rule::enum(WorkspaceMemberRole::class),
                Rule::notIn([WorkspaceMemberRole::Owner->value]),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'role.required' => 'O papel do membro é obrigatório.',
            'role.enum'     => 'Papel inválido. Use: admin ou member.',
            'role.not_in'   => 'O papel owner não pode ser atribuído desta forma.',
        ];
    }
}
