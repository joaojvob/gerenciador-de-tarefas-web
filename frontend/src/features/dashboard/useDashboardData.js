import { useEffect, useMemo, useState } from "react";
import { listTasks } from "../../services/tasks.service";
import { listWorkspaces } from "../../services/workspaces.service";
import { IN_PROGRESS_STATUSES } from "./constants";
import {
    buildCards,
    buildChartData,
    buildReportRows,
    exportRowsToCsv,
    exportRowsToPdf,
} from "./formatters";

export function useDashboardData(notifications) {
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [allTasks, setAllTasks] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [selectedChartSubject, setSelectedChartSubject] = useState("status");
    const [selectedChartType, setSelectedChartType] = useState("bar");
    const [reportScope, setReportScope] = useState("all");

    useEffect(() => {
        async function loadDashboardData() {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const workspaceList = await listWorkspaces();
                setWorkspaces(workspaceList);

                if (!workspaceList.length) {
                    setAllTasks([]);
                    return;
                }

                const tasksByWorkspace = await Promise.all(
                    workspaceList.map((workspace) => listTasks(workspace.slug)),
                );

                const tasks = tasksByWorkspace.flat();
                setAllTasks(tasks);
            } catch (error) {
                const message =
                    error?.response?.data?.message ??
                    "Não foi possível carregar os dados do dashboard.";

                setErrorMessage(message);
                notifications.error(message);
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboardData();
    }, [notifications]);

    const counts = useMemo(() => {
        const todayDateString = new Date().toISOString().slice(0, 10);

        const tasksTodayCount = allTasks.filter(
            (task) => task.due_date?.slice(0, 10) === todayDateString,
        ).length;

        const inProgressCount = allTasks.filter((task) =>
            IN_PROGRESS_STATUSES.includes(task.status),
        ).length;

        return {
            workspaceCount: workspaces.length,
            tasksTodayCount,
            inProgressCount,
        };
    }, [allTasks, workspaces]);

    const cards = useMemo(() => buildCards(counts), [counts]);

    const chartData = useMemo(
        () =>
            buildChartData({
                allTasks,
                workspaces,
                subject: selectedChartSubject,
            }),
        [allTasks, selectedChartSubject, workspaces],
    );

    const reportRows = useMemo(
        () => buildReportRows({ allTasks, reportScope, workspaces }),
        [allTasks, reportScope, workspaces],
    );

    const exportCsv = () => {
        if (!reportRows.length) {
            const message =
                "Não há dados para gerar relatório no escopo selecionado.";
            setErrorMessage(message);
            notifications.error(message);
            return;
        }

        exportRowsToCsv({ reportRows, reportScope });
        notifications.success("Relatório CSV exportado com sucesso.");
    };

    const exportPdf = async () => {
        if (!reportRows.length) {
            const message =
                "Não há dados para gerar relatório no escopo selecionado.";
            setErrorMessage(message);
            notifications.error(message);
            return;
        }

        try {
            await exportRowsToPdf({ reportRows, reportScope });
            notifications.success("Relatório PDF exportado com sucesso.");
        } catch {
            notifications.error(
                "Não foi possível exportar o relatório em PDF.",
            );
        }
    };

    return {
        isLoading,
        errorMessage,
        cards,
        chartData,
        selectedChartSubject,
        setSelectedChartSubject,
        selectedChartType,
        setSelectedChartType,
        reportScope,
        setReportScope,
        workspaces,
        exportCsv,
        exportPdf,
    };
}
