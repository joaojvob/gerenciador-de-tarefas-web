import { Activity, Briefcase, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

const metricIcons = {
    "Tarefas hoje": Calendar,
    "Em andamento": Activity,
    Workspaces: Briefcase,
};

function MetricsGrid({ cards, isLoading }) {
    return (
        <section className="grid gap-6 md:grid-cols-3">
            {cards.map((card) => {
                const Icon = metricIcons[card.label] ?? Activity;

                return (
                    <Card
                        key={card.label}
                        className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl shadow-slate-950/30 backdrop-blur-md transition-colors hover:border-slate-700"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pb-2 pt-6">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-300/80">
                                {card.label}
                            </CardTitle>
                            <div
                                className={`rounded-lg border p-2 ${card.bgLight} ${card.color} ${card.borderLight}`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <p className="mt-2 text-4xl font-extrabold tracking-tight text-white">
                                {isLoading ? (
                                    <span className="block h-10 w-16 animate-pulse rounded bg-slate-800" />
                                ) : (
                                    card.value
                                )}
                            </p>
                            <p className="mt-3 text-xs text-slate-400/70">
                                {card.help}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </section>
    );
}

export default MetricsGrid;
