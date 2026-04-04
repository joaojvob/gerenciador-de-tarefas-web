<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Workspace;
use App\Models\Task;
use App\Models\User;

class AdminWorkspaceController extends Controller
{
    /**
     * Retorna dados consolidados para o BI do Super Admin.
     */
    public function dashboard(Request $request): JsonResponse
    {
        // Proteção double-check caso o middleware falhe
        if (!$request->user()->is_super_admin) {
            abort(403, 'Acesso restrito a Super Administradores da plataforma.');
        }

        $metrics = [
            'total_workspaces' => Workspace::count(),
            'total_users'      => User::count(),
            'total_tasks'      => Task::count(),
            'plans_distribution' => [
                'free'    => Workspace::where('plan', 'free')->count(),
                'premium' => Workspace::where('plan', 'premium')->count(),
            ]
        ];

        return response()->json(['data' => $metrics]);
    }

    /**
     * Lista completa de workspaces ignorando o tenant isolation.
     */
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->is_super_admin) {
            abort(403);
        }

        $workspaces = Workspace::with(['owner'])->withCount(['members', 'tasks'])->paginate(50);

        return response()->json(['data' => $workspaces]);
    }
}
