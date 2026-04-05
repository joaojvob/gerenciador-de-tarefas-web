import AuthenticatedLayout from "../components/app/AuthenticatedLayout";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import ChartPanel from "../components/dashboard/ChartPanel";
import ReportsPanel from "../components/dashboard/ReportsPanel";
import { useDashboardData } from "../features/dashboard/useDashboardData";

function HomePage() {
    const { user } = useAuth();
    const notifications = useNotifications();
    const {
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
    } = useDashboardData(notifications);

    return (
        <AuthenticatedLayout
            title="Visão geral"
            subtitle={`Você está logado como ${user?.name ?? user?.email ?? "usuário"}.`}
        >
            <div className="mx-auto max-w-7xl space-y-6 pb-12 font-sans">
                <WelcomeBanner />

                {errorMessage ? (
                    <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                        <p className="text-sm font-medium text-red-400">
                            {errorMessage}
                        </p>
                    </div>
                ) : null}

                <MetricsGrid cards={cards} isLoading={isLoading} />

                <div className="grid gap-6 md:grid-cols-2">
                    <ChartPanel
                        chartData={chartData}
                        selectedChartSubject={selectedChartSubject}
                        onChangeChartSubject={setSelectedChartSubject}
                        selectedChartType={selectedChartType}
                        onChangeChartType={setSelectedChartType}
                    />

                    <ReportsPanel
                        reportScope={reportScope}
                        onChangeReportScope={setReportScope}
                        workspaces={workspaces}
                        onExportCsv={exportCsv}
                        onExportPdf={exportPdf}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default HomePage;
