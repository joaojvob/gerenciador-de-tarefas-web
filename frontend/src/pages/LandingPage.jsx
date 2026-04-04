import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-6 rounded-full border border-slate-700 px-4 py-1 text-sm text-slate-300">
          SaaS Multi-tenant com Laravel + React
        </span>

        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Gerencie tarefas por workspace com segurança e escala
        </h1>

        <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
          Uma plataforma para equipes organizarem tarefas com autenticação, isolamento por tenant
          e regras de permissão por papel.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/register"
            className="rounded-md bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400"
          >
            Registrar
          </Link>
          <Link
            to="/login"
            className="rounded-md border border-slate-600 px-6 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            Entrar
          </Link>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;