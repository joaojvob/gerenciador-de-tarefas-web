import { Card } from "../ui/Card";
import { formatDateLabel } from "../../features/tasks/constants";
import { CheckCircle2, CircleDashed, Clock } from "lucide-react";

function TaskTableView({ tasks }) {
    return (
        <Card className="overflow-hidden border-slate-800 bg-slate-900">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-slate-950 text-slate-300">
                        <tr>
                            <th className="px-4 py-3 font-medium">Título</th>
                            <th className="px-4 py-3 font-medium">Status</th>
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
                                    {task.assignee?.name ?? "Não atribuído"}
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
    );
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
export default TaskTableView;
