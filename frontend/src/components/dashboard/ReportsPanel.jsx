import { Download, FileSpreadsheet, FileType } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";

function ReportsPanel({
    reportScope,
    onChangeReportScope,
    workspaces,
    onExportCsv,
    onExportPdf,
}) {
    return (
        <Card className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl shadow-slate-950/30 backdrop-blur-md">
            <CardHeader className="mb-4 border-b border-slate-800/70 p-6 pb-4">
                <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
                    <CardTitle className="text-lg font-bold text-white">
                        Exportação de Dados
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col p-6">
                <p className="mb-6 text-sm leading-relaxed text-slate-300/80">
                    Extraia relatórios detalhados em CSV ou PDF, por organização
                    específica ou com visão global.
                </p>

                <div className="mt-auto space-y-4 rounded-xl border border-slate-800/70 bg-slate-900/70 p-5">
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400/80">
                            Escopo dos Dados
                        </label>
                        <select
                            className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 outline-none transition-all focus:border-indigo-500"
                            value={reportScope}
                            onChange={(event) =>
                                onChangeReportScope(event.target.value)
                            }
                        >
                            <option value="all">Todas as organizações</option>
                            {workspaces.map((workspace) => (
                                <option
                                    key={workspace.id}
                                    value={String(workspace.id)}
                                >
                                    {workspace.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        <Button
                            type="button"
                            onClick={onExportCsv}
                            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white shadow-lg transition-colors hover:bg-indigo-500"
                        >
                            <Download className="h-4 w-4" />
                            <span>Exportar CSV</span>
                        </Button>

                        <Button
                            type="button"
                            onClick={onExportPdf}
                            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white shadow-lg transition-colors hover:bg-emerald-500"
                        >
                            <FileType className="h-4 w-4" />
                            <span>Exportar PDF</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ReportsPanel;
