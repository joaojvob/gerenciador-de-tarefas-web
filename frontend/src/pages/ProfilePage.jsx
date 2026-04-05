import { useEffect, useState } from "react";
import AuthenticatedLayout from "../components/app/AuthenticatedLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Label } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import { updateProfile } from "../services/auth.service";

function ProfilePage() {
    const { user, updateAuthenticatedUser } = useAuth();
    const notifications = useNotifications();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        setForm((current) => ({
            ...current,
            name: user?.name ?? "",
            email: user?.email ?? "",
        }));
    }, [user?.email, user?.name]);

    async function handleSubmit(event) {
        event.preventDefault();
        setFieldErrors({});

        const localErrors = {};

        if (!form.name.trim()) {
            localErrors.name = "Informe seu nome.";
        }

        if (!form.email.trim()) {
            localErrors.email = "Informe seu e-mail.";
        }

        if (form.password && form.password.length < 8) {
            localErrors.password = "A senha deve ter ao menos 8 caracteres.";
        }

        if (form.password !== form.password_confirmation) {
            localErrors.password_confirmation = "As senhas não coincidem.";
        }

        if (Object.keys(localErrors).length) {
            setFieldErrors(localErrors);
            notifications.error(
                "Revise os campos obrigatórios e tente novamente.",
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = await updateProfile({
                name: form.name,
                email: form.email,
                password: form.password || undefined,
                password_confirmation: form.password_confirmation || undefined,
            });

            updateAuthenticatedUser(payload.user ?? null);
            setForm((current) => ({
                ...current,
                password: "",
                password_confirmation: "",
            }));
            notifications.success("Seu perfil foi atualizado.");
        } catch (error) {
            const apiErrors = error?.response?.data?.errors;
            if (apiErrors) {
                setFieldErrors({
                    name: apiErrors.name?.[0],
                    email: apiErrors.email?.[0],
                    password: apiErrors.password?.[0],
                    password_confirmation: apiErrors.password_confirmation?.[0],
                });
            }

            notifications.error(
                error?.response?.data?.message ??
                    "Não foi possível atualizar seu perfil.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthenticatedLayout
            title="Meu perfil"
            subtitle="Atualize seus dados pessoais e credenciais de acesso."
        >
            <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                    <CardTitle className="text-base text-slate-100">
                        Editar perfil
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        className="grid gap-4 md:grid-cols-2"
                        onSubmit={handleSubmit}
                    >
                        <div className="space-y-1">
                            <Label
                                htmlFor="profile-name"
                                className="text-slate-300"
                            >
                                Nome
                            </Label>
                            <Input
                                id="profile-name"
                                value={form.name}
                                className={`border-slate-700 bg-slate-950 text-slate-100 ${fieldErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        name: event.target.value,
                                    }))
                                }
                            />
                            {fieldErrors.name ? (
                                <p className="text-xs font-medium text-red-400">
                                    {fieldErrors.name}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="profile-email"
                                className="text-slate-300"
                            >
                                E-mail
                            </Label>
                            <Input
                                id="profile-email"
                                type="email"
                                value={form.email}
                                className={`border-slate-700 bg-slate-950 text-slate-100 ${fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        email: event.target.value,
                                    }))
                                }
                            />
                            {fieldErrors.email ? (
                                <p className="text-xs font-medium text-red-400">
                                    {fieldErrors.email}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="profile-password"
                                className="text-slate-300"
                            >
                                Nova senha
                            </Label>
                            <Input
                                id="profile-password"
                                type="password"
                                placeholder="Opcional"
                                value={form.password}
                                className={`border-slate-700 bg-slate-950 text-slate-100 ${fieldErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        password: event.target.value,
                                    }))
                                }
                            />
                            {fieldErrors.password ? (
                                <p className="text-xs font-medium text-red-400">
                                    {fieldErrors.password}
                                </p>
                            ) : null}
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="profile-password-confirmation"
                                className="text-slate-300"
                            >
                                Confirmar nova senha
                            </Label>
                            <Input
                                id="profile-password-confirmation"
                                type="password"
                                placeholder="Repita a senha"
                                value={form.password_confirmation}
                                className={`border-slate-700 bg-slate-950 text-slate-100 ${fieldErrors.password_confirmation ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        password_confirmation:
                                            event.target.value,
                                    }))
                                }
                            />
                            {fieldErrors.password_confirmation ? (
                                <p className="text-xs font-medium text-red-400">
                                    {fieldErrors.password_confirmation}
                                </p>
                            ) : null}
                        </div>

                        <div className="md:col-span-2">
                            <Button type="submit" loading={isSubmitting}>
                                Salvar alterações
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}

export default ProfilePage;
