import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";

function HomePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const cards = [
        {
            label: "Tarefas hoje",
            value: "0",
            help: "Sem tarefas planejadas para hoje.",
        },
        {
            label: "Em andamento",
            value: "0",
            help: "Fluxo inicial ainda não carregado.",
        },
        {
            label: "Workspaces",
            value: "1",
            help: "Seu ambiente principal está ativo.",
        },
    ];

    async function handleLogout() {
        await logout();
        navigate("/login", { replace: true });
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-14 text-slate-100 sm:py-20">
            <div className="mx-auto w-full max-w-6xl space-y-6">
                <Card className="border-slate-800 bg-slate-900">
                    <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Bem-vindo de volta
                            </h1>
                            <p className="mt-2 text-slate-300">
                                Você está logado como{" "}
                                <strong>
                                    {user?.name ?? user?.email ?? "usuário"}
                                </strong>
                                .
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                Próximo passo: conectar dados reais do workspace
                                e tarefas.
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleLogout}
                            className="border-slate-600"
                        >
                            Sair
                        </Button>
                    </CardContent>
                </Card>

                <section className="grid gap-4 md:grid-cols-3">
                    {cards.map((card) => (
                        <Card
                            key={card.label}
                            className="border-slate-800 bg-slate-900"
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-300">
                                    {card.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-slate-100">
                                    {card.value}
                                </p>
                                <p className="mt-2 text-xs text-slate-400">
                                    {card.help}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </div>
        </main>
    );
}

export default HomePage;
