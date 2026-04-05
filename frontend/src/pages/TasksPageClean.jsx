import AuthenticatedLayout from "../components/app/AuthenticatedLayout";
import { Card, CardContent } from "../components/ui/Card";
import TaskBoardView from "../components/tasks/TaskBoardView";
import TaskCreateModal from "../components/tasks/TaskCreateModal";
import TasksFeedback from "../components/tasks/TasksFeedback";
import TasksToolbar from "../components/tasks/TasksToolbar";
import TaskTableView from "../components/tasks/TaskTableView";
import { useNotifications } from "../hooks/useNotifications";
import { useAuth } from "../hooks/useAuth";
import { useTasksPageController } from "../features/tasks/useTasksPageController";

function TasksPageClean() {
    const { user } = useAuth();
    const notifications = useNotifications();

    const {
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
    } = useTasksPageController({ notifications, user });

    return (
        <AuthenticatedLayout
            title="Tarefas"
            subtitle="Acompanhe o fluxo de execução e priorize entregas do time. testeteste "
        >
            <TasksToolbar
                workspaces={workspaces}
                selectedWorkspaceSlug={selectedWorkspaceSlug}
                isLoadingWorkspace={isLoadingWorkspace}
                viewMode={viewMode}
                canCreateTasks={canCreateTasks}
                onChangeWorkspace={handleWorkspaceChange}
                onChangeViewMode={setViewMode}
                onOpenCreateModal={handleOpenCreateModal}
            />

            <TasksFeedback
                errorMessage={errorMessage}
                successMessage={successMessage}
            />

            <TaskCreateModal
                isOpen={isModalOpen}
                isSubmitting={isSubmitting}
                selectedWorkspaceSlug={selectedWorkspaceSlug}
                canCreateTasks={canCreateTasks}
                form={form}
                fieldErrors={fieldErrors}
                members={members}
                statusOptions={statusOptions}
                priorityOptions={priorityOptions}
                onChangeForm={(field, value) => {
                    setForm((current) => ({ ...current, [field]: value }));
                }}
                onSubmit={handleCreateTask}
                onClose={handleCloseCreateModal}
            />

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
                <TaskBoardView
                    boardColumns={boardColumns}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                />
            ) : null}

            {!isLoadingTasks && tasks.length && viewMode === "table" ? (
                <TaskTableView tasks={tasks} />
            ) : null}
        </AuthenticatedLayout>
    );
}

export default TasksPageClean;
