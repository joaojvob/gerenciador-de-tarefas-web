import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    createTask,
    listTasks,
    updateTaskStatus,
} from "../../services/tasks.service";
import {
    listWorkspaceMembers,
    listWorkspaces,
} from "../../services/workspaces.service";
import { priorityOptions, statusOptions } from "./constants";

export function useTasksPageController({ notifications, user }) {
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
                const message =
                    error?.response?.data?.message ??
                    "Não foi possível carregar os workspaces.";
                setErrorMessage(message);
                notifications.error(message);
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
                const message =
                    error?.response?.data?.message ??
                    "Não foi possível carregar tarefas deste workspace.";
                setErrorMessage(message);
                notifications.error(message);
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
            setFieldErrors({});
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

    function handleOpenCreateModal() {
        setFieldErrors({});
        setIsModalOpen(true);
    }

    function handleCloseCreateModal() {
        if (isSubmitting) {
            return;
        }

        setIsModalOpen(false);
    }

    return {
        workspaces,
        selectedWorkspaceSlug,
        members,
        tasks,
        isLoadingWorkspace,
        isLoadingTasks,
        isSubmitting,
        viewMode,
        isModalOpen,
        errorMessage,
        successMessage,
        fieldErrors,
        form,
        boardColumns,
        canCreateTasks,
        statusOptions,
        priorityOptions,
        setViewMode,
        setForm,
        handleWorkspaceChange,
        handleCreateTask,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleOpenCreateModal,
        handleCloseCreateModal,
    };
}
