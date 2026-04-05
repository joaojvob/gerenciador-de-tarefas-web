import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import {
    CHART_SUBJECT_OPTIONS,
    CHART_TYPE_OPTIONS,
} from "../../features/dashboard/constants";
import { buildChartSegments } from "../../features/dashboard/formatters";

function BarChart({ chartData }) {
    const maxChartValue =
        chartData.length > 0
            ? Math.max(...chartData.map((item) => item.value))
            : 0;

    return (
        <div className="space-y-5">
            {chartData.map((item) => (
                <div key={item.label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-300">
                            {item.label}
                        </span>
                        <span className="text-slate-400">{item.value}</span>
                    </div>
                    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-800/70">
                        <div
                            className="relative h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 transition-all duration-700 ease-out"
                            style={{
                                width: `${maxChartValue ? (item.value / maxChartValue) * 100 : 0}%`,
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function PieLikeChart({ chartData, type }) {
    const segments = buildChartSegments(chartData);
    const stops = segments
        .map((segment) => `${segment.color} ${segment.start}% ${segment.end}%`)
        .join(", ");

    return (
        <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
            <div className="mx-auto">
                <div
                    className="h-52 w-52 rounded-full border border-slate-700"
                    style={{
                        background: `conic-gradient(${stops || "#334155 0% 100%"})`,
                    }}
                >
                    {type === "donut" ? (
                        <div className="m-auto mt-[26px] h-40 w-40 rounded-full bg-slate-900/95" />
                    ) : null}
                </div>
            </div>

            <div className="space-y-3">
                {segments.map((segment) => (
                    <div
                        key={segment.label}
                        className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: segment.color }}
                            />
                            <span className="text-slate-300">
                                {segment.label}
                            </span>
                        </div>
                        <span className="text-slate-400">
                            {segment.value} ({segment.percent}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ChartPanel({
    chartData,
    selectedChartSubject,
    onChangeChartSubject,
    selectedChartType,
    onChangeChartType,
}) {
    return (
        <Card className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl shadow-slate-950/30 backdrop-blur-md">
            <CardHeader className="mb-4 border-b border-slate-800/70 p-6 pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-indigo-400" />
                        <CardTitle className="text-lg font-bold text-white">
                            Distribuição Visual
                        </CardTitle>
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 outline-none transition-all focus:border-indigo-500"
                            value={selectedChartSubject}
                            onChange={(event) =>
                                onChangeChartSubject(event.target.value)
                            }
                        >
                            {CHART_SUBJECT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <select
                            className="h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 outline-none transition-all focus:border-indigo-500"
                            value={selectedChartType}
                            onChange={(event) =>
                                onChangeChartType(event.target.value)
                            }
                        >
                            {CHART_TYPE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-6">
                {!chartData.length ? (
                    <div className="py-10 text-center">
                        <p className="text-sm text-slate-400/80">
                            Sem dados suficientes para gerar o gráfico.
                        </p>
                    </div>
                ) : null}

                {chartData.length && selectedChartType === "bar" ? (
                    <BarChart chartData={chartData} />
                ) : null}

                {chartData.length && selectedChartType === "pie" ? (
                    <PieLikeChart chartData={chartData} type="pie" />
                ) : null}

                {chartData.length && selectedChartType === "donut" ? (
                    <PieLikeChart chartData={chartData} type="donut" />
                ) : null}
            </CardContent>
        </Card>
    );
}

export default ChartPanel;
