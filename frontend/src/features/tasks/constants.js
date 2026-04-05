export const statusOptions = [
    { value: "backlog", label: "Não iniciada" },
    { value: "assigned", label: "Vinculada" },
    { value: "in_progress", label: "Em andamento" },
    { value: "paused", label: "Pausada" },
    { value: "pending", label: "Pendente" },
    { value: "completed", label: "Concluída" },
    { value: "incomplete", label: "Não concluída" },
];

export const priorityOptions = [
    { value: "low", label: "Baixa" },
    { value: "medium", label: "Média" },
    { value: "high", label: "Alta" },
    { value: "urgent", label: "Urgente" },
];

export function formatDateLabel(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString("pt-BR");
}

export function getPriorityBadgeClass(priority) {
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

export function getInitials(name) {
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
