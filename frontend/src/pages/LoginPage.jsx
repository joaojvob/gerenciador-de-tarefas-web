import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      await login(form);
      navigate('/home', { replace: true });
    } catch (error) {
      const apiMessage = error.response?.data?.message;
      setErrorMessage(apiMessage ?? 'Não foi possível entrar. Verifique suas credenciais.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
      <div className="mx-auto w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="mt-2 text-sm text-slate-400">Acesse sua conta para continuar.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm">E-mail</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="voce@empresa.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm">Senha</label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="••••••••"
            />
          </div>

          {errorMessage && (
            <p className="rounded-md border border-red-900 bg-red-950/40 p-2 text-sm text-red-300">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60"
          >
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          Não tem conta?{' '}
          <Link className="text-indigo-400 hover:underline" to="/register">
            Criar agora
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;