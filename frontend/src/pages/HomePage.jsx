import AuthenticatedLayout from "../components/app/AuthenticatedLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";

function HomePage() {
    const { user } = useAuth();

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

    return (
        <AuthenticatedLayout
            title="Visão geral"
            subtitle={`Você está logado como ${user?.name ?? user?.email ?? "usuário"}.`}
        >
            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900">
                    <CardContent className="p-6">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Bem-vindo de volta
                            </h2>
                            <p className="mt-2 text-slate-300">
                                Este painel centraliza seus próximos passos com
                                workspaces e tarefas.
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                Próximo passo: integrar métricas reais da API.
                            </p>
                        </div>
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
        </AuthenticatedLayout>
    );
}

export default HomePage;
