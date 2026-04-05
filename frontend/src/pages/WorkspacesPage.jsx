import AuthenticatedLayout from "../components/app/AuthenticatedLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";

function WorkspacesPage() {
    const workspaces = [
        {
            name: "Workspace Principal",
            role: "owner",
            members: 1,
            tasks: 0,
        },
    ];

    return (
        <AuthenticatedLayout
            title="Workspaces"
            subtitle="Gerencie ambientes, membros e permissões do seu time."
        >
            <section className="grid gap-4">
                {workspaces.map((workspace) => (
                    <Card
                        key={workspace.name}
                        className="border-slate-800 bg-slate-900"
                    >
                        <CardHeader>
                            <CardTitle className="text-slate-100">
                                {workspace.name}
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Papel atual: {workspace.role}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-slate-300">
                                <p>Membros: {workspace.members}</p>
                                <p>Tarefas ativas: {workspace.tasks}</p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                                >
                                    Ver membros
                                </Button>
                                <Button type="button">Abrir board</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <Card className="border-dashed border-slate-700 bg-slate-900/40">
                    <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-medium text-slate-200">
                                Criar novo workspace
                            </p>
                            <p className="text-sm text-slate-400">
                                Separe projetos por cliente, produto ou time.
                            </p>
                        </div>
                        <Button type="button">Novo workspace</Button>
                    </CardContent>
                </Card>
            </section>
        </AuthenticatedLayout>
    );
}

export default WorkspacesPage;
