import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowLeft,
    Layers,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

function AuthPage({ initialMode = "login" }) {
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const [isRegisterMode, setIsRegisterMode] = useState(
        initialMode === "register",
    );
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const toggleMode = () => {
        setErrorMessage("");
        setIsRegisterMode((current) => !current);
        setLoginData({ email: "", password: "" });
        setRegisterData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        try {
            await login(loginData);
            navigate("/home", { replace: true });
        } catch (error) {
            setErrorMessage(
                error?.response?.data?.message ?? "E-mail ou senha incorretos.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");

        if (registerData.password !== registerData.confirmPassword) {
            setErrorMessage("As senhas não coincidem.");
            return;
        }

        setIsLoading(true);

        try {
            await register({
                name: registerData.fullName,
                email: registerData.email,
                password: registerData.password,
                password_confirmation: registerData.confirmPassword,
            });

            navigate("/home", { replace: true });
        } catch (error) {
            setErrorMessage(
                error?.response?.data?.message ??
                    "Não foi possível criar sua conta.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const LoginForm = () => (
        <form
            className="mx-auto w-full max-w-[320px] space-y-4"
            onSubmit={handleLoginSubmit}
        >
            <div className="mb-6 text-center">
                <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                    Entrar
                </h1>
                <div className="mb-4 flex justify-center gap-3">
                    <button
                        type="button"
                        className="rounded-full border border-slate-700 p-2 text-slate-400 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                    >
                        <Mail size={18} />
                    </button>
                    <button
                        type="button"
                        className="rounded-full border border-slate-700 p-2 text-slate-400 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                    >
                        <Lock size={18} />
                    </button>
                    <button
                        type="button"
                        className="rounded-full border border-slate-700 p-2 text-slate-400 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                    >
                        <User size={18} />
                    </button>
                </div>
                <p className="text-xs text-slate-500">
                    ou use a sua conta de e-mail
                </p>
            </div>

            {errorMessage && !isRegisterMode && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                    <AlertCircle
                        className="mt-0.5 shrink-0 text-red-400"
                        size={16}
                    />
                    <p className="text-xs font-medium text-red-400">
                        {errorMessage}
                    </p>
                </div>
            )}

            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Mail size={16} />
                </div>
                <input
                    type="email"
                    required
                    placeholder="Email"
                    className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={loginData.email}
                    onChange={(event) =>
                        setLoginData({
                            ...loginData,
                            email: event.target.value,
                        })
                    }
                />
            </div>

            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Lock size={16} />
                </div>
                <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Senha"
                    className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={loginData.password}
                    onChange={(event) =>
                        setLoginData({
                            ...loginData,
                            password: event.target.value,
                        })
                    }
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 transition-colors hover:text-slate-300"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>

            <div className="my-2 flex justify-center">
                <button
                    type="button"
                    className="text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                >
                    Esqueceu a senha?
                </button>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-indigo-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    "Entrar"
                )}
            </button>
        </form>
    );

    const RegisterForm = () => (
        <form
            className="mx-auto w-full max-w-[320px] space-y-4"
            onSubmit={handleRegisterSubmit}
        >
            <div className="mb-6 text-center">
                <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                    Criar Conta
                </h1>
                <div className="mb-4 flex justify-center gap-3">
                    <button
                        type="button"
                        className="rounded-full border border-slate-700 p-2 text-slate-400 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                    >
                        <Mail size={18} />
                    </button>
                    <button
                        type="button"
                        className="rounded-full border border-slate-700 p-2 text-slate-400 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                    >
                        <Lock size={18} />
                    </button>
                    <button
                        type="button"
                        className="rounded-full border border-slate-700 p-2 text-slate-400 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                    >
                        <User size={18} />
                    </button>
                </div>
                <p className="text-xs text-slate-500">
                    ou preencha os seus dados abaixo
                </p>
            </div>

            {errorMessage && isRegisterMode && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                    <AlertCircle
                        className="mt-0.5 shrink-0 text-red-400"
                        size={16}
                    />
                    <p className="text-xs font-medium text-red-400">
                        {errorMessage}
                    </p>
                </div>
            )}

            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <User size={16} />
                </div>
                <input
                    type="text"
                    required
                    placeholder="Nome"
                    className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={registerData.fullName}
                    onChange={(event) =>
                        setRegisterData({
                            ...registerData,
                            fullName: event.target.value,
                        })
                    }
                />
            </div>

            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Mail size={16} />
                </div>
                <input
                    type="email"
                    required
                    placeholder="Email"
                    className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={registerData.email}
                    onChange={(event) =>
                        setRegisterData({
                            ...registerData,
                            email: event.target.value,
                        })
                    }
                />
            </div>

            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Lock size={16} />
                </div>
                <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Senha"
                    className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={registerData.password}
                    onChange={(event) =>
                        setRegisterData({
                            ...registerData,
                            password: event.target.value,
                        })
                    }
                />
            </div>

            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Lock size={16} />
                </div>
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirmar Senha"
                    className="block w-full rounded-lg border border-slate-700 bg-slate-900/50 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={registerData.confirmPassword}
                    onChange={(event) =>
                        setRegisterData({
                            ...registerData,
                            confirmPassword: event.target.value,
                        })
                    }
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 transition-colors hover:text-slate-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? (
                        <EyeOff size={16} />
                    ) : (
                        <Eye size={16} />
                    )}
                </button>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-indigo-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    "Inscreva-se"
                )}
            </button>
        </form>
    );

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 p-4 font-sans selection:bg-indigo-500/30">
            <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[120px]" />

            <div className="absolute left-6 top-6 z-50">
                <button
                    onClick={() => navigate("/")}
                    className="group flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                >
                    <ArrowLeft
                        size={16}
                        className="transition-transform group-hover:-translate-x-1"
                    />
                    Voltar ao início
                </button>
            </div>

            <div className="relative hidden min-h-[600px] w-full max-w-[850px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-xl md:block">
                <div
                    className={`absolute left-0 top-0 flex h-full w-1/2 flex-col justify-center p-10 transition-all duration-[600ms] ease-in-out ${isRegisterMode ? "z-50 translate-x-full pointer-events-auto opacity-100" : "z-10 pointer-events-none opacity-0"}`}
                >
                    <RegisterForm />
                </div>

                <div
                    className={`absolute left-0 top-0 z-20 flex h-full w-1/2 flex-col justify-center p-10 transition-all duration-[600ms] ease-in-out ${isRegisterMode ? "translate-x-full pointer-events-none opacity-0" : "translate-x-0 pointer-events-auto opacity-100"}`}
                >
                    <LoginForm />
                </div>

                <div
                    className={`absolute left-1/2 top-0 z-[100] h-full w-1/2 overflow-hidden transition-transform duration-[600ms] ease-in-out ${isRegisterMode ? "-translate-x-full" : "translate-x-0"}`}
                >
                    <div
                        className={`relative -left-full h-full w-[200%] border-l border-indigo-500/30 bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-700 text-white shadow-inner transition-transform duration-[600ms] ease-in-out ${isRegisterMode ? "translate-x-1/2" : "translate-x-0"}`}
                    >
                        <div
                            className={`absolute left-0 top-0 flex h-full w-1/2 flex-col items-center justify-center px-12 text-center transition-transform duration-[600ms] ease-in-out ${isRegisterMode ? "translate-x-0" : "-translate-x-[20%]"}`}
                        >
                            <Layers className="mb-6 text-white/80" size={48} />
                            <h1 className="mb-4 text-4xl font-extrabold">
                                Bem-vindo
                                <br />
                                de volta!
                            </h1>
                            <p className="mb-8 text-sm font-light leading-relaxed text-indigo-100">
                                Para se manter conectado conosco, faça login com
                                seus dados pessoais.
                            </p>
                            <button
                                onClick={toggleMode}
                                className="rounded-full border border-white bg-transparent px-12 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-indigo-700"
                            >
                                Entrar
                            </button>
                        </div>

                        <div
                            className={`absolute right-0 top-0 flex h-full w-1/2 flex-col items-center justify-center px-12 text-center transition-transform duration-[600ms] ease-in-out ${isRegisterMode ? "translate-x-[20%]" : "translate-x-0"}`}
                        >
                            <Layers className="mb-6 text-white/80" size={48} />
                            <h1 className="mb-4 text-4xl font-extrabold">
                                Olá, Amigo!
                            </h1>
                            <p className="mb-8 text-sm font-light leading-relaxed text-indigo-100">
                                Insira seus dados pessoais e comece a organizar
                                tarefas com nossa plataforma.
                            </p>
                            <button
                                onClick={toggleMode}
                                className="rounded-full border border-white bg-transparent px-12 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-indigo-700"
                            >
                                Criar conta
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex w-full max-w-md flex-col pt-10 md:hidden">
                <div className="mb-6 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight text-white">
                    <Layers className="text-indigo-400" size={28} /> TaskFlow
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-8 shadow-xl backdrop-blur-xl">
                    <div className="relative transition-all duration-500 ease-in-out">
                        {!isRegisterMode ? <LoginForm /> : <RegisterForm />}
                    </div>

                    <div className="mt-8 border-t border-slate-800 pt-6 text-center">
                        <p className="text-sm text-slate-400">
                            {!isRegisterMode
                                ? "Ainda não tem conta? "
                                : "Já possui conta? "}
                            <button
                                onClick={toggleMode}
                                className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                            >
                                {!isRegisterMode
                                    ? "Inscreva-se aqui"
                                    : "Entrar aqui"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
