<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TarefaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'titulo'          => 'required|string|max:255',
            'descricao'       => 'nullable|string',
            'data_vencimento' => 'nullable|date_format:Y-m-d\TH:i',
            'prioridade'      => 'nullable|in:Baixa,Média,Alta',
            'status'          => 'nullable|in:Pendente,Em Andamento,Concluida,Cancelada',
        ];
    }

    public function messages()
    {
        return [
            'titulo.required'             => 'O título é obrigatório.',
            'data_vencimento.date_format' => 'A data deve estar no formato correto.',
        ];
    }
}
