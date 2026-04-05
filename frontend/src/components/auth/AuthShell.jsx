import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/Card";

function AuthShell({ title, subtitle, children, footer }) {
    return (
        <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
            <div className="mx-auto w-full max-w-md animate-fade-up">
                <div className="mb-6 text-center animate-fade-up [animation-delay:90ms]">
                    <Link
                        to="/"
                        className="inline-flex rounded-full border border-slate-700 px-4 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
                    >
                        Gerenciador de Tarefas
                    </Link>
                </div>

                <Card className="border-slate-800 bg-slate-900 animate-fade-up [animation-delay:180ms]">
                    <CardHeader>
                        <CardTitle className="text-2xl text-slate-100">
                            {title}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            {subtitle}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {children}
                        {footer ? (
                            <div className="mt-4 text-sm text-slate-400">
                                {footer}
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

export default AuthShell;
