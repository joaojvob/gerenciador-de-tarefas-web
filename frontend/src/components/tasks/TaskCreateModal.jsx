import { Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input, Label } from "../ui/Input";

function TaskCreateModal({
    isOpen,
    isSubmitting,
    selectedWorkspaceSlug,
    canCreateTasks,
    form,
    fieldErrors,
    members,
    statusOptions,
    priorityOptions,
    onChangeForm,
    onSubmit,
    onClose,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
            onClick={onClose}
        >
            <Card
                className="w-full max-w-3xl border-slate-700 bg-slate-900 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/70">
                    <CardTitle className="flex items-center gap-2 text-slate-100">
                        <Plus size={18} /> Nova tarefa
                    </CardTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        <X size={16} />
                    </Button>
                </CardHeader>

                <CardContent className="pt-6">
                    <form
                        onSubmit={onSubmit}
                        className="grid gap-3 md:grid-cols-2"
                        autoComplete="off"
                    >
                        <div className="space-y-1 md:col-span-2">
                            <Label
                                htmlFor="task-title"
                                className="text-slate-300"
                            >
                                Título
                            </Label>
                            <Input
                                id="task-title"
                                autoComplete="off"
                                placeholder="Ex.: Implementar filtro de tarefas"
                                className={`border-slate-700 bg-slate-950 text-slate-100 ${fieldErrors.title ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                value={form.title}
                                onChange={(event) =>
                                    onChangeForm("title", event.target.value)
                                }
                                required
                                disabled={
                                    !selectedWorkspaceSlug || !canCreateTasks
                                }
                            />
                            {fieldErrors.title ? (
                                <p className="text-xs font-medium text-red-400">
                                    {fieldErrors.title}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <Label
                                htmlFor="task-description"
                                className="text-slate-300"
                            >
                                Descrição
                            </Label>
                            <textarea
                                id="task-description"
                                autoComplete="off"
                                className={`min-h-20 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 ${fieldErrors.description ? "border-red-500" : ""}`}
                                value={form.description}
                                onChange={(event) =>
                                    onChangeForm(
                                        "description",
                                        event.target.value,
                                    )
                                }
                                disabled={
                                    !selectedWorkspaceSlug || !canCreateTasks
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="task-priority"
                                className="text-slate-300"
                            >
                                Prioridade
                            </Label>
                            <select
                                id="task-priority"
                                className={`flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 ${fieldErrors.priority ? "border-red-500" : ""}`}
                                value={form.priority}
                                onChange={(event) =>
                                    onChangeForm("priority", event.target.value)
                                }
                                disabled={
                                    !selectedWorkspaceSlug || !canCreateTasks
                                }
                            >
                                {priorityOptions.map((priority) => (
                                    <option
                                        key={priority.value}
                                        value={priority.value}
                                    >
                                        {priority.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="task-status"
                                className="text-slate-300"
                            >
                                Status
                            </Label>
                            <select
                                id="task-status"
                                className={`flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 ${fieldErrors.status ? "border-red-500" : ""}`}
                                value={form.status}
                                onChange={(event) =>
                                    onChangeForm("status", event.target.value)
                                }
                                disabled={
                                    !selectedWorkspaceSlug || !canCreateTasks
                                }
                            >
                                {statusOptions.map((status) => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-slate-300">Vencimento</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    id="task-due-date"
                                    type="date"
                                    autoComplete="off"
                                    className={`border-slate-700 bg-slate-950 text-slate-100 ${fieldErrors.due_date ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    value={form.due_date_date}
                                    onChange={(event) =>
                                        onChangeForm(
                                            "due_date_date",
                                            event.target.value,
                                        )
                                    }
                                    disabled={
                                        !selectedWorkspaceSlug ||
                                        !canCreateTasks
                                    }
                                />
                                <Input
                                    id="task-due-time"
                                    type="time"
                                    autoComplete="off"
                                    className={`border-slate-700 bg-slate-950 text-slate-100 ${fieldErrors.due_date ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    value={form.due_date_time}
                                    onChange={(event) =>
                                        onChangeForm(
                                            "due_date_time",
                                            event.target.value,
                                        )
                                    }
                                    disabled={
                                        !selectedWorkspaceSlug ||
                                        !canCreateTasks
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="task-assignee"
                                className="text-slate-300"
                            >
                                Responsável
                            </Label>
                            <select
                                id="task-assignee"
                                className={`flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 ${fieldErrors.assigned_to ? "border-red-500" : ""}`}
                                value={form.assigned_to}
                                onChange={(event) =>
                                    onChangeForm(
                                        "assigned_to",
                                        event.target.value,
                                    )
                                }
                                disabled={
                                    !selectedWorkspaceSlug || !canCreateTasks
                                }
                            >
                                <option value="">Sem responsável</option>
                                {members.map((member) => (
                                    <option
                                        key={member.user?.id}
                                        value={member.user?.id}
                                    >
                                        {member.user?.name ??
                                            member.user?.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2 flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                loading={isSubmitting}
                                disabled={
                                    !selectedWorkspaceSlug || !canCreateTasks
                                }
                            >
                                Criar tarefa
                            </Button>
                        </div>
                    </form>

                    {!canCreateTasks ? (
                        <p className="mt-3 text-sm text-amber-300">
                            Você não possui permissão para criar tarefas neste
                            workspace.
                        </p>
                    ) : null}
                </CardContent>
            </Card>
        </div>
    );
}

export default TaskCreateModal;
