<?php

namespace App\Http\Requests\Workspace;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkspaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'min:2', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do workspace é obrigatório.',
            'name.min'      => 'O nome deve ter ao menos 2 caracteres.',
            'name.max'      => 'O nome deve ter no máximo 100 caracteres.',
        ];
    }
}
