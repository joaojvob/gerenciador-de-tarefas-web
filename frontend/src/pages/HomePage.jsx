import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Área autenticada</h1>
        <p className="mt-2 text-slate-300">
          Você está logado como <strong>{user?.name ?? user?.email ?? 'usuário'}</strong>.
        </p>
        <p className="mt-4 text-sm text-slate-400">
          Próximo passo: construir dashboard de workspaces e tarefas.
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 rounded-md border border-slate-600 px-4 py-2 text-sm font-semibold transition hover:bg-slate-800"
        >
          Sair
        </button>
      </div>
    </main>
  );
}

export default HomePage;