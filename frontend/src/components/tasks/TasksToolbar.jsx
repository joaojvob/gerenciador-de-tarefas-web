import { Kanban, List, Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { Label } from "../ui/Input";

function TasksToolbar({
    workspaces,
    selectedWorkspaceSlug,
    isLoadingWorkspace,
    viewMode,
    canCreateTasks,
    onChangeWorkspace,
    onChangeViewMode,
    onOpenCreateModal,
}) {
    return (
        <div className="mb-4 grid gap-3 md:grid-cols-3">
            <div className="space-y-1 md:col-span-2">
                <Label htmlFor="workspace-selector" className="text-slate-300">
                    Workspace ativo
                </Label>
                <select
                    id="workspace-selector"
                    className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                    value={selectedWorkspaceSlug}
                    onChange={onChangeWorkspace}
                    disabled={isLoadingWorkspace || !workspaces.length}
                >
                    {!workspaces.length ? (
                        <option value="">Sem workspaces disponíveis</option>
                    ) : null}
                    {workspaces.map((workspace) => (
                        <option key={workspace.slug} value={workspace.slug}>
                            {workspace.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-1">
                <Label className="text-slate-300">Visualização</Label>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant={viewMode === "board" ? "primary" : "outline"}
                        className={
                            viewMode === "board"
                                ? ""
                                : "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                        }
                        onClick={() => onChangeViewMode("board")}
                    >
                        <Kanban size={16} /> Quadro
                    </Button>

                    <Button
                        type="button"
                        variant={viewMode === "table" ? "primary" : "outline"}
                        className={
                            viewMode === "table"
                                ? ""
                                : "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                        }
                        onClick={() => onChangeViewMode("table")}
                    >
                        <List size={16} /> Tabela
                    </Button>

                    <Button
                        type="button"
                        disabled={!selectedWorkspaceSlug || !canCreateTasks}
                        onClick={onOpenCreateModal}
                    >
                        <Plus size={16} /> Nova tarefa
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default TasksToolbar;
