import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthenticatedLayout from "../components/app/AuthenticatedLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/Card";
import {
    CalendarDays,
    CheckCircle2,
    CircleDashed,
    Clock,
    Kanban,
    List,
    Plus,
    User,
    X,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input, Label } from "../components/ui/Input";
import {
    createTask,
    listTasks,
    updateTaskStatus,
} from "../services/tasks.service";
import { useNotifications } from "../hooks/useNotifications";
import { useAuth } from "../hooks/useAuth";
import {
    listWorkspaceMembers,
    listWorkspaces,
} from "../services/workspaces.service";

const statusOptions = [
    { value: "backlog", label: "Não iniciada" },
    { value: "assigned", label: "Vinculada" },
    { value: "in_progress", label: "Em andamento" },
    { value: "paused", label: "Pausada" },
    { value: "pending", label: "Pendente" },
    { value: "completed", label: "Concluída" },
    { value: "incomplete", label: "Não concluída" },
];

const priorityOptions = [
    { value: "low", label: "Baixa" },
    { value: "medium", label: "Média" },
    { value: "high", label: "Alta" },
    { value: "urgent", label: "Urgente" },
];

function formatDateLabel(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString("pt-BR");
}

function getPriorityBadgeClass(priority) {
    switch (priority) {
        case "urgent":
            return "border-rose-500/20 bg-rose-500/10 text-rose-400";
        case "high":
            return "border-amber-500/20 bg-amber-500/10 text-amber-400";
        case "medium":
            return "border-blue-500/20 bg-blue-500/10 text-blue-400";
        case "low":
            return "border-slate-500/20 bg-slate-500/10 text-slate-400";
        default:
            return "border-slate-700 bg-slate-800 text-slate-300";
    }
}

function getStatusIcon(status) {
    switch (status) {
        case "completed":
            return <CheckCircle2 size={16} className="text-emerald-500" />;
        case "in_progress":
            return <Clock size={16} className="text-indigo-400" />;
        default:
            return <CircleDashed size={16} className="text-slate-500" />;
    }
}

function getInitials(name) {
    if (!name) {
        return "?";
    }

    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
}

function TasksPage() {
    const { user } = useAuth();
    const notifications = useNotifications();
    const [searchParams, setSearchParams] = useSearchParams();
    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWorkspaceSlug, setSelectedWorkspaceSlug] = useState("");
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [viewMode, setViewMode] = useState("board");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "medium",
        status: "backlog",
        due_date_date: "",
        due_date_time: "",
        assigned_to: "",
    });

    useEffect(() => {
        async function loadWorkspacesAndSelection() {
            setIsLoadingWorkspace(true);
            setErrorMessage("");

            try {
                const workspaceList = await listWorkspaces();
                setWorkspaces(workspaceList);

                const queryWorkspace = searchParams.get("workspace");
                const persistedWorkspace = localStorage.getItem(
                    "active_workspace_slug",
                );

                const fallbackSlug = workspaceList[0]?.slug ?? "";
                const nextSelectedSlug =
                    queryWorkspace || persistedWorkspace || fallbackSlug;

                if (nextSelectedSlug) {
                    setSelectedWorkspaceSlug(nextSelectedSlug);
                    localStorage.setItem(
                        "active_workspace_slug",
                        nextSelectedSlug,
                    );
                    setSearchParams({ workspace: nextSelectedSlug });
                }
            } catch (error) {
                setErrorMessage(
                    error?.response?.data?.message ??
                        "Não foi possível carregar os workspaces.",
                );
                notifications.error(
                    error?.response?.data?.message ??
                        "Não foi possível carregar os workspaces.",
                );
            } finally {
                setIsLoadingWorkspace(false);
            }
        }

        loadWorkspacesAndSelection();
    }, []);

    useEffect(() => {
        if (!selectedWorkspaceSlug) {
            return;
        }

        async function loadWorkspaceData() {
            setIsLoadingTasks(true);
            setErrorMessage("");

            try {
                const [taskList, memberList] = await Promise.all([
                    listTasks(selectedWorkspaceSlug),
                    listWorkspaceMembers(selectedWorkspaceSlug),
                ]);

                setTasks(taskList);
                setMembers(memberList);
            } catch (error) {
                setErrorMessage(
                    error?.response?.data?.message ??
                        "Não foi possível carregar tarefas deste workspace.",
                );
                notifications.error(
                    error?.response?.data?.message ??
                        "Não foi possível carregar tarefas deste workspace.",
                );
            } finally {
                setIsLoadingTasks(false);
            }
        }

        loadWorkspaceData();
    }, [selectedWorkspaceSlug]);

    const boardColumns = useMemo(() => {
        const columnsByStatus = statusOptions.map((statusOption) => ({
            key: statusOption.value,
            title: statusOption.label,
            tasks: tasks.filter((task) => task.status === statusOption.value),
        }));

        const unknownStatusColumns = tasks
            .filter(
                (task) =>
                    !statusOptions.some(
                        (statusOption) => statusOption.value === task.status,
                    ),
            )
            .reduce((accumulator, task) => {
                if (!accumulator[task.status]) {
                    accumulator[task.status] = [];
                }

                accumulator[task.status].push(task);
                return accumulator;
            }, {});

        const normalizedUnknownColumns = Object.entries(
            unknownStatusColumns,
        ).map(([status, statusTasks]) => ({
            key: status,
            title: status,
            tasks: statusTasks,
        }));

        return [...columnsByStatus, ...normalizedUnknownColumns];
    }, [tasks]);

    const canCreateTasks = useMemo(() => {
        if (user?.is_super_admin) {
            return true;
        }

        const currentMembership = members.find(
            (member) => member.user?.id === user?.id,
        );

        if (!currentMembership) {
            return false;
        }

        if (
            currentMembership.role === "owner" ||
            currentMembership.role === "admin"
        ) {
            return true;
        }

        return Boolean(currentMembership.permissions?.can_create_tasks);
    }, [members, user]);

    function handleWorkspaceChange(event) {
        const nextSlug = event.target.value;

        setSelectedWorkspaceSlug(nextSlug);
        localStorage.setItem("active_workspace_slug", nextSlug);
        setSearchParams({ workspace: nextSlug });
    }

    async function refreshTasks() {
        if (!selectedWorkspaceSlug) {
            return;
        }

        const refreshedTasks = await listTasks(selectedWorkspaceSlug);
        setTasks(refreshedTasks);
    }

    async function handleCreateTask(event) {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setFieldErrors({});

        if (!canCreateTasks) {
            const message =
                "Você não tem permissão para criar tarefas neste workspace.";
            setErrorMessage(message);
            notifications.error(message);
            return;
        }

        const localErrors = {};

        if (!form.title.trim()) {
            localErrors.title = "Informe o título da tarefa.";
        }

        if (!form.priority) {
            localErrors.priority = "Selecione uma prioridade.";
        }

        if (!form.status) {
            localErrors.status = "Selecione um status.";
        }

        if (form.due_date_date) {
            const normalizedDueDate = new Date(
                `${form.due_date_date}T${form.due_date_time || "23:59"}`,
            );

            if (Number.isNaN(normalizedDueDate.getTime())) {
                localErrors.due_date = "Data de vencimento inválida.";
            } else if (normalizedDueDate <= new Date()) {
                localErrors.due_date = "A data de vencimento deve ser futura.";
            }
        }

        if (Object.keys(localErrors).length) {
            setFieldErrors(localErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            await createTask(selectedWorkspaceSlug, {
                title: form.title,
                description: form.description || null,
                priority: form.priority,
                status: form.status,
                due_date: form.due_date_date
                    ? `${form.due_date_date}T${form.due_date_time || "23:59"}:00`
                    : null,
                assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
            });

            setSuccessMessage("Tarefa criada com sucesso.");
            notifications.success("Tarefa criada com sucesso.");
            setForm((current) => ({
                ...current,
                title: "",
                description: "",
                due_date_date: "",
                due_date_time: "",
                assigned_to: "",
            }));
            setIsModalOpen(false);
            await refreshTasks();
        } catch (error) {
            const apiErrors = error?.response?.data?.errors;
            const firstError = apiErrors
                ? Object.values(apiErrors)?.[0]?.[0]
                : null;

            if (apiErrors) {
                setFieldErrors({
                    title: apiErrors.title?.[0],
                    description: apiErrors.description?.[0],
                    priority: apiErrors.priority?.[0],
                    status: apiErrors.status?.[0],
                    due_date: apiErrors.due_date?.[0],
                    assigned_to: apiErrors.assigned_to?.[0],
                });
            }

            setErrorMessage(
                firstError ??
                    error?.response?.data?.message ??
                    "Não foi possível criar a tarefa.",
            );
            notifications.error(
                firstError ??
                    error?.response?.data?.message ??
                    "Não foi possível criar a tarefa.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleDragStart(event, taskId) {
        event.dataTransfer.setData("text/task-id", String(taskId));
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    async function handleDrop(event, nextStatus) {
        event.preventDefault();

        const taskIdRaw = event.dataTransfer.getData("text/task-id");
        const taskId = Number(taskIdRaw);

        if (!taskId || Number.isNaN(taskId)) {
            return;
        }

        const currentTask = tasks.find((task) => task.id === taskId);
        if (!currentTask || currentTask.status === nextStatus) {
            return;
        }

        const nextStatusLabel =
            statusOptions.find((status) => status.value === nextStatus)
                ?.label ?? nextStatus;

        const previousTasks = tasks;

        setTasks((current) =>
            current.map((task) =>
                task.id === taskId
                    ? {
                          ...task,
                          status: nextStatus,
                          status_label: nextStatusLabel,
                      }
                    : task,
            ),
        );

        try {
            await updateTaskStatus(selectedWorkspaceSlug, taskId, nextStatus);
            notifications.success("Status da tarefa atualizado.");
        } catch (error) {
            setTasks(previousTasks);
            notifications.error(
                error?.response?.data?.message ??
                    "Não foi possível mover a tarefa.",
            );
        }
    }

    return (
        <AuthenticatedLayout
            title="Tarefas"
            subtitle="Acompanhe o fluxo de execução e priorize entregas do time."
        >
            <div className="mb-4 grid gap-3 md:grid-cols-3">
                <div className="space-y-1 md:col-span-2">
                    <Label
                        htmlFor="workspace-selector"
                        className="text-slate-300"
                    >
                        Workspace ativo
                    </Label>
                    <select
                        id="workspace-selector"
                        className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                        value={selectedWorkspaceSlug}
                        onChange={handleWorkspaceChange}
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
                            variant={
                                viewMode === "board" ? "primary" : "outline"
                            }
                            className={
                                viewMode === "board"
                                    ? ""
                                    : "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                            }
                            onClick={() => setViewMode("board")}
                        >
                            <Kanban size={16} /> Quadro
                        </Button>
                        <Button
                            type="button"
                            variant={
                                viewMode === "table" ? "primary" : "outline"
                            }
                            className={
                                viewMode === "table"
                                    ? ""
                                    : "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                            }
                            onClick={() => setViewMode("table")}
                        >
                            <List size={16} /> Tabela
                        </Button>
                        <Button
                            type="button"
                            disabled={!selectedWorkspaceSlug || !canCreateTasks}
                            onClick={() => {
                                setFieldErrors({});
                                setIsModalOpen(true);
                            }}
                        >
                            <Plus size={16} /> Nova tarefa
                        </Button>
                    </div>
                </div>
            </div>

            {errorMessage ? (
                <p className="mb-4 rounded-md border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
                    {errorMessage}
                </p>
            ) : null}

            {successMessage ? (
                <p className="mb-4 rounded-md border border-emerald-900 bg-emerald-950/40 p-3 text-sm text-emerald-300">
                    {successMessage}
                </p>
            ) : null}

            {isModalOpen ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
                    onClick={() => {
                        if (!isSubmitting) {
                            setIsModalOpen(false);
                        }
                    }}
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
                                onClick={() => setIsModalOpen(false)}
                                disabled={isSubmitting}
                            >
                                <X size={16} />
                            </Button>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <form
                                onSubmit={handleCreateTask}
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
                                            setForm((current) => ({
                                                ...current,
                                                title: event.target.value,
                                            }))
                                        }
                                        required
                                        disabled={
                                            !selectedWorkspaceSlug ||
                                            !canCreateTasks
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
                                            setForm((current) => ({
                                                ...current,
                                                description: event.target.value,
                                            }))
                                        }
                                        disabled={
                                            !selectedWorkspaceSlug ||
                                            !canCreateTasks
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
                                            setForm((current) => ({
                                                ...current,
                                                priority: event.target.value,
                                            }))
                                        }
                                        disabled={
                                            !selectedWorkspaceSlug ||
                                            !canCreateTasks
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
                                            setForm((current) => ({
                                                ...current,
                                                status: event.target.value,
                                            }))
                                        }
                                        disabled={
                                            !selectedWorkspaceSlug ||
                                            !canCreateTasks
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
                                    <Label className="text-slate-300">
                                        Vencimento
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            id="task-due-date"
                                            type="date"
                                            autoComplete="off"
                                            className={`border-slate-700 bg-slate-950 text-slate-100 ${fieldErrors.due_date ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                            value={form.due_date_date}
                                            onChange={(event) =>
                                                setForm((current) => ({
                                                    ...current,
                                                    due_date_date:
                                                        event.target.value,
                                                }))
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
                                                setForm((current) => ({
                                                    ...current,
                                                    due_date_time:
                                                        event.target.value,
                                                }))
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
                                            setForm((current) => ({
                                                ...current,
                                                assigned_to: event.target.value,
                                            }))
                                        }
                                        disabled={
                                            !selectedWorkspaceSlug ||
                                            !canCreateTasks
                                        }
                                    >
                                        <option value="">
                                            Sem responsável
                                        </option>
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
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        loading={isSubmitting}
                                        disabled={
                                            !selectedWorkspaceSlug ||
                                            !canCreateTasks
                                        }
                                    >
                                        Criar tarefa
                                    </Button>
                                </div>
                            </form>

                            {!canCreateTasks ? (
                                <p className="mt-3 text-sm text-amber-300">
                                    Você não possui permissão para criar tarefas
                                    neste workspace.
                                </p>
                            ) : null}
                        </CardContent>
                    </Card>
                </div>
            ) : null}

            {isLoadingTasks ? (
                <Card className="border-slate-800 bg-slate-900">
                    <CardContent className="p-6 text-sm text-slate-400">
                        Carregando tarefas...
                    </CardContent>
                </Card>
            ) : null}

            {!isLoadingTasks && !tasks.length ? (
                <Card className="border-slate-800 bg-slate-900">
                    <CardContent className="p-6 text-sm text-slate-400">
                        Nenhuma tarefa encontrada para este workspace.
                    </CardContent>
                </Card>
            ) : null}

            {!isLoadingTasks && tasks.length && viewMode === "board" ? (
                <section className="grid gap-4 lg:grid-cols-3">
                    {boardColumns.map((column) => (
                        <Card
                            key={column.key}
                            className="border-slate-800 bg-slate-900"
                            onDragOver={handleDragOver}
                            onDrop={(event) => handleDrop(event, column.key)}
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base text-slate-200">
                                    {getStatusIcon(column.key)}
                                    {column.title} ({column.tasks.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {column.tasks.length ? (
                                    column.tasks.map((task) => (
                                        <article
                                            key={task.id}
                                            draggable
                                            onDragStart={(event) =>
                                                handleDragStart(event, task.id)
                                            }
                                            className="cursor-grab rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-indigo-500/50 active:cursor-grabbing"
                                        >
                                            <p className="font-medium text-slate-100">
                                                {task.title}
                                            </p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span
                                                    className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getPriorityBadgeClass(task.priority)}`}
                                                >
                                                    {task.priority_label}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                                    <CalendarDays size={12} />
                                                    {formatDateLabel(
                                                        task.due_date,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex items-center justify-end">
                                                {task.assignee ? (
                                                    <span
                                                        className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-[10px] font-bold text-slate-300"
                                                        title={
                                                            task.assignee.name
                                                        }
                                                    >
                                                        {getInitials(
                                                            task.assignee.name,
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-slate-600 text-slate-500">
                                                        <User size={12} />
                                                    </span>
                                                )}
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500">
                                        Arraste tarefas para esta coluna.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </section>
            ) : null}

            {!isLoadingTasks && tasks.length && viewMode === "table" ? (
                <Card className="overflow-hidden border-slate-800 bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="bg-slate-950 text-slate-300">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Título
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Prioridade
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Responsável
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Vencimento
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr
                                        key={task.id}
                                        className="border-t border-slate-800"
                                    >
                                        <td className="px-4 py-3 text-slate-100">
                                            {task.title}
                                        </td>
                                        <td className="px-4 py-3 text-slate-300">
                                            <span className="flex items-center gap-2">
                                                {getStatusIcon(task.status)}
                                                {task.status_label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-300">
                                            {task.priority_label}
                                        </td>
                                        <td className="px-4 py-3 text-slate-300">
                                            {task.assignee?.name ??
                                                "Não atribuído"}
                                        </td>
                                        <td className="px-4 py-3 text-slate-300">
                                            {formatDateLabel(task.due_date)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : null}
        </AuthenticatedLayout>
    );
}

export default TasksPage;
