<?php

namespace App\Http\Controllers\Api;

use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\Tarefa;
use App\Models\User;

class ApiController extends Controller
{
    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'email'    => 'required|email',
                'password' => 'required',
            ]);

            if (auth()->attempt($data)) {
                $user  = auth()->user();
                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'token'   => $token,
                    'user'    => $user,
                    'message' => 'Login realizado com sucesso!'
                ], 200);
            }

            return response()->json([
                'message' => 'Credenciais inválidas. Verifique seu e-mail ou senha.'
            ], 401);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => [
                    'email'    => $request->email ? 'O e-mail informado não é válido.' : 'O campo e-mail é obrigatório.',
                    'password' => $request->password ? null : 'O campo senha é obrigatório.'
                ]
            ], 422);
        }
    }

    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name'     => 'required|string|max:255',
                'email'    => 'required|email|unique:users,email',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'token'   => $token,
                'user'    => $user,
                'message' => 'Usuário registrado com sucesso! Bem-vindo(a).'
            ], 201);
        } catch (ValidationException $e) {
            $errors = [];

            if ($e->validator->errors()->has('name')) {
                $errors['name'] = 'O campo nome é obrigatório.';
            }

            if ($e->validator->errors()->has('email')) {
                $errors['email'] = $request->email
                    ? 'O e-mail informado já está em uso ou não é válido.'
                    : 'O campo e-mail é obrigatório.';
            }

            if ($e->validator->errors()->has('password')) {
                $errors['password'] = 'A senha deve ter pelo menos 8 caracteres.';
            }

            if ($e->validator->errors()->has('password_confirmation')) {
                $errors['password_confirmation'] = 'As senhas não coincidem.';
            }

            return response()->json([
                'message' => 'Erro ao registrar usuário',
                'errors'  => $errors
            ], 422);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout realizado com sucesso. Até logo!']);
    }

    public function updatePassword(Request $request)
    {
        try {
            $request->validate([
                'current_password' => 'required|string',
                'password'         => 'required|string|min:8|confirmed',
            ]);

            $user = auth()->user();

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'A senha atual está incorreta.',
                    'errors'  => ['current_password' => 'A senha atual fornecida não está correta.']
                ], 422);
            }

            $user->update(['password' => Hash::make($request->password)]);

            return response()->json(['message' => 'Senha atualizada com sucesso!']);
        } catch (ValidationException $e) {
            $errors = [];

            if ($e->validator->errors()->has('current_password')) {
                $errors['current_password'] = 'O campo senha atual é obrigatório.';
            }

            if ($e->validator->errors()->has('password')) {
                $errors['password'] = 'A nova senha deve ter pelo menos 8 caracteres.';
            }

            if ($e->validator->errors()->has('password_confirmation')) {
                $errors['password_confirmation'] = 'As senhas não coincidem.';
            }

            return response()->json([
                'message' => 'Erro ao atualizar senha',
                'errors'  => $errors
            ], 422);
        }
    }

    public function apiIndex(Request $request)
    {
        $tarefas = Tarefa::where('user_id', auth()->id())->orderBy('ordem')->get();

        return response()->json([
            'data'    => $tarefas,
            'message' => 'Tarefas carregadas com sucesso.'
        ], 200);
    }

    public function apiShow(Tarefa $tarefa)
    {
        $this->authorizeTarefa($tarefa);

        return response()->json([
            'data'    => $tarefa,
            'message' => 'Tarefa encontrada com sucesso.'
        ], 200);
    }

    public function apiStore(Request $request)
    {
        try {
            $request->validate([
                'titulo'          => 'required|string|max:255',
                'descricao'       => 'nullable|string',
                'data_vencimento' => 'nullable|date',
                'prioridade'      => 'nullable|in:Baixa,Media,Alta',
                'status'          => 'nullable|in:Pendente,Em Andamento,Concluida,Cancelada',
                'ordem'           => 'nullable|integer',
            ]);

            $tarefa = Tarefa::create([
                'user_id'         => auth()->id(),
                'titulo'          => $request->titulo,
                'descricao'       => $request->descricao,
                'data_vencimento' => $request->data_vencimento,
                'prioridade'      => $request->prioridade ?? 'Media',
                'status'          => $request->status ?? 'Pendente',
                'ordem'           => $request->ordem ?? Tarefa::where('user_id', auth()->id())->max('ordem') + 1,
            ]);

            return response()->json([
                'data'    => $tarefa,
                'message' => 'Tarefa criada com sucesso!'
            ], 201);
        } catch (ValidationException $e) {
            $errors = [];

            if ($e->validator->errors()->has('titulo')) {
                $errors['titulo'] = 'O campo título é obrigatório e deve ter no máximo 255 caracteres.';
            }

            if ($e->validator->errors()->has('data_vencimento')) {
                $errors['data_vencimento'] = 'A data de vencimento deve estar em um formato válido.';
            }

            if ($e->validator->errors()->has('prioridade')) {
                $errors['prioridade'] = 'A prioridade deve ser Baixa, Média ou Alta.';
            }

            if ($e->validator->errors()->has('status')) {
                $errors['status'] = 'O status deve ser Pendente, Em Andamento, Concluída ou Cancelada.';
            }

            return response()->json([
                'message' => 'Erro ao criar tarefa',
                'errors'  => $errors
            ], 422);
        }
    }

    public function apiUpdate(Request $request, Tarefa $tarefa)
    {
        try {
            $this->authorizeTarefa($tarefa);

            $request->validate([
                'titulo'          => 'required|string|max:255',
                'descricao'       => 'nullable|string',
                'data_vencimento' => 'nullable|date',
                'prioridade'      => 'nullable|in:Baixa,Media,Alta',
                'status'          => 'nullable|in:Pendente,Em Andamento,Concluida,Cancelada',
                'ordem'           => 'nullable|integer',
            ]);

            $tarefa->update($request->only(['titulo', 'descricao', 'data_vencimento', 'prioridade', 'status', 'ordem']));

            return response()->json([
                'data'    => $tarefa,
                'message' => 'Tarefa atualizada com sucesso!'
            ], 200);
        } catch (ValidationException $e) {
            $errors = [];

            if ($e->validator->errors()->has('titulo')) {
                $errors['titulo'] = 'O campo título é obrigatório e deve ter no máximo 255 caracteres.';
            }

            if ($e->validator->errors()->has('data_vencimento')) {
                $errors['data_vencimento'] = 'A data de vencimento deve estar em um formato válido.';
            }

            if ($e->validator->errors()->has('prioridade')) {
                $errors['prioridade'] = 'A prioridade deve ser Baixa, Média ou Alta.';
            }

            if ($e->validator->errors()->has('status')) {
                $errors['status'] = 'O status deve ser Pendente, Em Andamento, Concluída ou Cancelada.';
            }

            return response()->json([
                'message' => 'Erro ao atualizar tarefa',
                'errors'  => $errors
            ], 422);
        }
    }

    public function apiDestroy(Tarefa $tarefa)
    {
        $this->authorizeTarefa($tarefa);
        $tarefa->delete();

        return response()->json(['message' => 'Tarefa excluída com sucesso!'], 200);
    }

    protected function authorizeTarefa(Tarefa $tarefa)
    {
        if ($tarefa->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Ação não autorizada. Você não tem permissão para modificar esta tarefa.'
            ], 403);
        }
    }
}
