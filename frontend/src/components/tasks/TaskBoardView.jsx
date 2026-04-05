import {
    CalendarDays,
    CheckCircle2,
    CircleDashed,
    Clock,
    User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import {
    formatDateLabel,
    getInitials,
    getPriorityBadgeClass,
} from "../../features/tasks/constants";

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

function TaskBoardView({ boardColumns, onDragStart, onDragOver, onDrop }) {
    return (
        <section className="grid gap-4 lg:grid-cols-3">
            {boardColumns.map((column) => (
                <Card
                    key={column.key}
                    className="border-slate-800 bg-slate-900"
                    onDragOver={onDragOver}
                    onDrop={(event) => onDrop(event, column.key)}
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
                                        onDragStart(event, task.id)
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
                                            {formatDateLabel(task.due_date)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-end">
                                        {task.assignee ? (
                                            <span
                                                className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-[10px] font-bold text-slate-300"
                                                title={task.assignee.name}
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
    );
}

export default TaskBoardView;
