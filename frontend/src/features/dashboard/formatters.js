import { CHART_COLORS } from "./constants";

export function buildCards({
    tasksTodayCount,
    inProgressCount,
    workspaceCount,
}) {
    return [
        {
            label: "Tarefas hoje",
            value: String(tasksTodayCount),
            help:
                tasksTodayCount > 0
                    ? "Tarefas com vencimento para hoje."
                    : "Sem tarefas planejadas para hoje.",
            color: "text-indigo-400",
            bgLight: "bg-indigo-500/10",
            borderLight: "border-indigo-500/20",
        },
        {
            label: "Em andamento",
            value: String(inProgressCount),
            help:
                inProgressCount > 0
                    ? "Tarefas ativas no fluxo de execução."
                    : "Nenhuma tarefa em andamento no momento.",
            color: "text-cyan-400",
            bgLight: "bg-cyan-500/10",
            borderLight: "border-cyan-500/20",
        },
        {
            label: "Workspaces",
            value: String(workspaceCount),
            help:
                workspaceCount > 0
                    ? "Ambientes vinculados ao seu usuário."
                    : "Nenhum workspace criado ainda.",
            color: "text-emerald-400",
            bgLight: "bg-emerald-500/10",
            borderLight: "border-emerald-500/20",
        },
    ];
}

export function buildChartData({ allTasks, workspaces, subject }) {
    if (subject === "status") {
        const grouped = allTasks.reduce((accumulator, task) => {
            const key = task.status_label ?? task.status ?? "Sem status";
            accumulator[key] = (accumulator[key] ?? 0) + 1;
            return accumulator;
        }, {});

        return Object.entries(grouped).map(([label, value]) => ({
            label,
            value,
        }));
    }

    if (subject === "priority") {
        const grouped = allTasks.reduce((accumulator, task) => {
            const key =
                task.priority_label ?? task.priority ?? "Sem prioridade";
            accumulator[key] = (accumulator[key] ?? 0) + 1;
            return accumulator;
        }, {});

        return Object.entries(grouped).map(([label, value]) => ({
            label,
            value,
        }));
    }

    const groupedByWorkspace = allTasks.reduce((accumulator, task) => {
        const key = String(task.workspace_id ?? "desconhecido");
        accumulator[key] = (accumulator[key] ?? 0) + 1;
        return accumulator;
    }, {});

    return workspaces.map((workspace) => ({
        label: workspace.name,
        value: groupedByWorkspace[String(workspace.id)] ?? 0,
    }));
}

export function buildChartSegments(chartData) {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    let cursor = 0;

    return chartData.map((item, index) => {
        const fraction = total > 0 ? item.value / total : 0;
        const start = cursor;
        const end = cursor + fraction * 100;
        cursor = end;

        return {
            ...item,
            color: CHART_COLORS[index % CHART_COLORS.length],
            start,
            end,
            percent: total > 0 ? Number((fraction * 100).toFixed(1)) : 0,
        };
    });
}

export function buildReportRows({ allTasks, reportScope, workspaces }) {
    const workspaceById = new Map(workspaces.map((item) => [item.id, item]));

    const tasksToExport =
        reportScope === "all"
            ? allTasks
            : allTasks.filter(
                  (task) => String(task.workspace_id) === reportScope,
              );

    return tasksToExport.map((task) => ({
        workspace:
            workspaceById.get(task.workspace_id)?.name ??
            `Workspace #${task.workspace_id}`,
        titulo: task.title,
        status: task.status_label ?? task.status,
        prioridade: task.priority_label ?? task.priority,
        responsavel: task.assignee?.name ?? task.assignee?.email ?? "",
        vencimento: task.due_date ?? "",
    }));
}

export function exportRowsToCsv({ reportRows, reportScope }) {
    const headers = [
        "workspace",
        "titulo",
        "status",
        "prioridade",
        "responsavel",
        "vencimento",
    ];

    const csvLines = [
        headers.join(","),
        ...reportRows.map((row) =>
            headers
                .map((header) => {
                    const value = row[header] ?? "";
                    return `"${String(value).replaceAll('"', '""')}"`;
                })
                .join(","),
        ),
    ];

    const blob = new Blob([csvLines.join("\n")], {
        type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
        reportScope === "all"
            ? "relatorio-todas-organizacoes.csv"
            : `relatorio-workspace-${reportScope}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

export async function exportRowsToPdf({ reportRows, reportScope }) {
    const { jsPDF } = await import("jspdf");
    const autoTableModule = await import("jspdf-autotable");
    const autoTable = autoTableModule.default;

    const doc = new jsPDF({ orientation: "landscape" });
    const title =
        reportScope === "all"
            ? "Relatório - Todas as Organizações"
            : `Relatório - Workspace ${reportScope}`;

    doc.setFontSize(14);
    doc.text(title, 14, 14);

    const head = [
        [
            "Workspace",
            "Título",
            "Status",
            "Prioridade",
            "Responsável",
            "Vencimento",
        ],
    ];
    const body = reportRows.map((row) => [
        row.workspace,
        row.titulo,
        row.status,
        row.prioridade,
        row.responsavel,
        row.vencimento,
    ]);

    autoTable(doc, {
        head,
        body,
        startY: 20,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [79, 70, 229] },
    });

    const fileName =
        reportScope === "all"
            ? "relatorio-todas-organizacoes.pdf"
            : `relatorio-workspace-${reportScope}.pdf`;

    doc.save(fileName);
}
