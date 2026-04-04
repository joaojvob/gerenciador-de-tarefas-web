import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    if (form.password !== form.password_confirmation) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
      navigate('/login', { replace: true });
    } catch (error) {
      const apiMessage = error.response?.data?.message;
      setErrorMessage(apiMessage ?? 'Não foi possível criar sua conta.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
      <div className="mx-auto w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="mt-2 text-sm text-slate-400">Registre-se para começar seu workspace.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm">Nome</label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="Seu nome"
            />
          </div>

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

          <div className="space-y-1">
            <label htmlFor="password_confirmation" className="text-sm">Confirmar senha</label>
            <input
              id="password_confirmation"
              type="password"
              required
              value={form.password_confirmation}
              onChange={(event) =>
                setForm((current) => ({ ...current, password_confirmation: event.target.value }))
              }
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
            {submitting ? 'Criando conta...' : 'Registrar'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          Já possui conta?{' '}
          <Link className="text-indigo-400 hover:underline" to="/login">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;