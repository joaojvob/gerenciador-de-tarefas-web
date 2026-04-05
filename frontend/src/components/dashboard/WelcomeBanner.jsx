import { LayoutDashboard, Sparkles } from "lucide-react";
import { Card, CardContent } from "../ui/Card";

function WelcomeBanner() {
    return (
        <Card className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 shadow-xl shadow-indigo-900/20">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
            <CardContent className="relative z-10 flex items-center justify-between p-8">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-indigo-300" />
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-100 md:text-3xl">
                            Bem-vindo de volta
                        </h2>
                    </div>
                    <p className="max-w-2xl text-base text-slate-200">
                        Este painel centraliza os seus próximos passos com
                        workspaces e tarefas.
                    </p>
                    <p className="mt-2 text-sm font-medium text-indigo-100/70">
                        Indicadores carregados em tempo real.
                    </p>
                </div>
                <div className="hidden rounded-full border border-indigo-300/20 bg-slate-900/50 p-4 md:flex">
                    <LayoutDashboard className="h-10 w-10 text-slate-300/80" />
                </div>
            </CardContent>
        </Card>
    );
}

export default WelcomeBanner;
