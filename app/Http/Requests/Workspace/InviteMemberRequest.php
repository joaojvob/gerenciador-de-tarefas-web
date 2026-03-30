<?php

namespace App\Http\Requests\Workspace;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InviteMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'string',
                'email',
                'exists:users,email',
                Rule::unique('workspace_members', 'user_id')->where(
                    fn ($query) => $query->where(
                        'workspace_id',
                        $this->route('workspace')->id
                    )
                ),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'O e-mail é obrigatório.',
            'email.email'    => 'Informe um e-mail válido.',
            'email.exists'   => 'Nenhum usuário encontrado com este e-mail.',
            'email.unique'   => 'Este usuário já é membro do workspace.',
        ];
    }
}
