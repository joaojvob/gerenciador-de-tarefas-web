import { CheckCircle2, LayoutDashboard, Users } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import WorkspaceMemberPanel from "./WorkspaceMemberPanel";

function WorkspaceCard({
    workspace,
    isExpanded,
    onToggleMembers,
    onOpenBoard,
    memberPanelProps,
}) {
    return (
        <Card className="group overflow-visible border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <CardHeader className="flex flex-col justify-between gap-4 border-b border-slate-800/50 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-lg font-bold text-indigo-300">
                        {workspace.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg text-white">
                            {workspace.name}
                            <span
                                className={`rounded-full border px-2 py-0.5 text-xs ${workspace.personal ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400" : "border-slate-700 bg-slate-800 text-slate-300"}`}
                            >
                                {workspace.personal ? "Proprietário" : "Membro"}
                            </span>
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-4 text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <Users size={14} className="text-slate-500" />
                                {workspace.members?.length ?? 0} Membros
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2
                                    size={14}
                                    className="text-emerald-500/70"
                                />
                                {workspace.tasks_count ?? 0} Tarefas
                            </span>
                        </CardDescription>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onToggleMembers(workspace.slug)}
                    >
                        <Users size={16} />
                        {isExpanded ? "Ocultar" : "Gerir Equip"}
                    </Button>
                    <Button onClick={() => onOpenBoard(workspace.slug)}>
                        <LayoutDashboard size={16} />
                        Dashboard
                    </Button>
                </div>
            </CardHeader>

            {isExpanded ? (
                <WorkspaceMemberPanel
                    workspace={workspace}
                    {...memberPanelProps}
                />
            ) : null}
        </Card>
    );
}

export default WorkspaceCard;
