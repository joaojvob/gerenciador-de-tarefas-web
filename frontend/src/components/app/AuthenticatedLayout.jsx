import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
    { to: "/home", label: "Visão geral" },
    { to: "/workspaces", label: "Workspaces" },
    { to: "/tasks", label: "Tarefas" },
];

function AuthenticatedLayout({ title, subtitle, children }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    async function handleLogout() {
        await logout();
        navigate("/login", { replace: true });
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                            TaskFlow
                        </p>
                        <h1 className="text-lg font-semibold text-white">
                            {title}
                        </h1>
                    </div>

                    <div className="hidden items-center gap-2 sm:flex">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `rounded-md px-3 py-2 text-sm transition ${
                                        isActive
                                            ? "bg-slate-800 text-white"
                                            : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm text-slate-400 md:inline">
                            {user?.name ?? user?.email ?? "usuário"}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                            onClick={handleLogout}
                        >
                            Sair
                        </Button>
                    </div>
                </div>
            </header>

            <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:py-10">
                {subtitle ? (
                    <p className="text-sm text-slate-400">{subtitle}</p>
                ) : null}
                {children}
            </div>
        </main>
    );
}

export default AuthenticatedLayout;
