import AuthenticatedLayout from "../components/app/AuthenticatedLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const columns = [
    {
        title: "A Fazer",
        tasks: ["Definir escopo do onboarding", "Mapear estados da tarefa"],
    },
    {
        title: "Em Andamento",
        tasks: ["Implementar integrações da dashboard"],
    },
    {
        title: "Concluído",
        tasks: ["Estrutura base de autenticação"],
    },
];

function TasksPage() {
    return (
        <AuthenticatedLayout
            title="Tarefas"
            subtitle="Acompanhe o fluxo de execução e priorize entregas do time."
        >
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">
                    Board inicial para continuidade do desenvolvimento.
                </p>
                <Button type="button">Nova tarefa</Button>
            </div>

            <section className="grid gap-4 md:grid-cols-3">
                {columns.map((column) => (
                    <Card
                        key={column.title}
                        className="border-slate-800 bg-slate-900"
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base text-slate-200">
                                {column.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {column.tasks.map((task) => (
                                <article
                                    key={task}
                                    className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                                >
                                    {task}
                                </article>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </section>
        </AuthenticatedLayout>
    );
}

export default TasksPage;
