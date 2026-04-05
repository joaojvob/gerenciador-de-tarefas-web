import {
    Lock,
    Mail,
    Pencil,
    Shield,
    Trash2,
    User,
    UserPlus,
    X,
} from "lucide-react";
import { Button } from "../ui/Button";
import IconInput from "./IconInput";

function getInitials(name) {
    if (!name) {
        return "U";
    }

    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
}

function WorkspaceMemberPanel({
    memberMode,
    onChangeMemberMode,
    memberFieldErrors,
    inviteForm,
    onChangeInviteForm,
    onSubmitInvite,
    registerMemberForm,
    onChangeRegisterMemberForm,
    onSubmitRegisterMember,
    isSubmittingMember,
    isLoadingMembers,
    members,
    isEditMemberModalOpen,
    editingMemberForm,
    removingMemberUserId,
    onOpenEditMember,
    onCloseEditMember,
    onChangeEditMemberField,
    onSaveMemberEdit,
    onRemoveMember,
}) {
    return (
        <>
            <div className="animate-in slide-in-from-top-2 border-t border-slate-800/50 bg-slate-950/50 p-6 duration-300">
                <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-inner">
                    <div className="mb-5 flex w-fit rounded-lg border border-slate-800 bg-slate-950 p-1">
                        <button
                            type="button"
                            onClick={() => onChangeMemberMode("invite")}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${memberMode === "invite" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                        >
                            Convidar Existente
                        </button>
                        <button
                            type="button"
                            onClick={() => onChangeMemberMode("register")}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${memberMode === "register" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                        >
                            Criar Nova Conta
                        </button>
                    </div>

                    {memberMode === "invite" ? (
                        <form
                            className="flex flex-col items-start gap-3 sm:flex-row"
                            onSubmit={onSubmitInvite}
                            autoComplete="off"
                        >
                            <div className="relative w-full flex-1">
                                <IconInput
                                    icon={Mail}
                                    type="email"
                                    autoComplete="off"
                                    placeholder="e-mail do colega"
                                    value={inviteForm.email}
                                    onChange={(event) =>
                                        onChangeInviteForm(
                                            "email",
                                            event.target.value,
                                        )
                                    }
                                    inputClassName={
                                        memberFieldErrors.email
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {memberFieldErrors.email ? (
                                    <p className="absolute mt-1 text-xs text-red-400">
                                        {memberFieldErrors.email}
                                    </p>
                                ) : null}
                            </div>
                            <Button
                                type="submit"
                                loading={isSubmittingMember}
                                className="mt-6 w-full sm:mt-0 sm:w-auto"
                            >
                                <UserPlus size={16} /> Enviar Convite
                            </Button>
                        </form>
                    ) : (
                        <form
                            className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-5"
                            onSubmit={onSubmitRegisterMember}
                            autoComplete="off"
                        >
                            <div className="relative lg:col-span-1">
                                <IconInput
                                    icon={User}
                                    autoComplete="off"
                                    placeholder="Nome"
                                    value={registerMemberForm.name}
                                    onChange={(event) =>
                                        onChangeRegisterMemberForm(
                                            "name",
                                            event.target.value,
                                        )
                                    }
                                    inputClassName={
                                        memberFieldErrors.name
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {memberFieldErrors.name ? (
                                    <p className="absolute mt-1 text-xs text-red-400">
                                        {memberFieldErrors.name}
                                    </p>
                                ) : null}
                            </div>

                            <div className="relative lg:col-span-1">
                                <IconInput
                                    icon={Mail}
                                    type="email"
                                    autoComplete="off"
                                    placeholder="E-mail"
                                    value={registerMemberForm.email}
                                    onChange={(event) =>
                                        onChangeRegisterMemberForm(
                                            "email",
                                            event.target.value,
                                        )
                                    }
                                    inputClassName={
                                        memberFieldErrors.email
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                            </div>

                            <div className="relative lg:col-span-1">
                                <IconInput
                                    icon={Lock}
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Senha"
                                    value={registerMemberForm.password}
                                    onChange={(event) =>
                                        onChangeRegisterMemberForm(
                                            "password",
                                            event.target.value,
                                        )
                                    }
                                    inputClassName={
                                        memberFieldErrors.password
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                            </div>

                            <div className="relative lg:col-span-1">
                                <IconInput
                                    icon={Lock}
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Confirmar"
                                    value={
                                        registerMemberForm.password_confirmation
                                    }
                                    onChange={(event) =>
                                        onChangeRegisterMemberForm(
                                            "password_confirmation",
                                            event.target.value,
                                        )
                                    }
                                    inputClassName={
                                        memberFieldErrors.password_confirmation
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                            </div>

                            <div className="lg:col-span-1">
                                <Button
                                    type="submit"
                                    loading={isSubmittingMember}
                                    className="w-full"
                                >
                                    Registar
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

                <div>
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
                        <Shield size={14} className="text-slate-500" />
                        Equipe Atual
                    </h4>

                    {isLoadingMembers ? (
                        <div className="py-4 text-sm text-slate-400">
                            Carregando membros...
                        </div>
                    ) : null}

                    {!isLoadingMembers && !members.length ? (
                        <p className="text-sm italic text-slate-500">
                            Sem membros listados.
                        </p>
                    ) : null}

                    {!isLoadingMembers && members.length ? (
                        <div className="space-y-2">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-3 transition-colors hover:border-slate-700 sm:flex-row sm:items-center"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-bold text-slate-400 shadow-inner">
                                            {getInitials(
                                                member.user?.name ||
                                                    member.user?.email,
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {member.user?.name ??
                                                    member.user?.email}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {member.user?.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${
                                                member.role === "owner"
                                                    ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                                                    : member.role === "admin"
                                                      ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                                                      : "border-slate-700 bg-slate-800 text-slate-300"
                                            }`}
                                        >
                                            {member.role === "owner" ? (
                                                <Shield size={12} />
                                            ) : null}
                                            {member.role_label}
                                        </span>

                                        {member.permissions?.can_create_tasks &&
                                        member.role === "member" ? (
                                            <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                                                Pode criar tarefas
                                            </span>
                                        ) : null}

                                        {member.role !== "owner" ? (
                                            <>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="h-8 border-slate-700 bg-slate-900 px-3 text-xs text-slate-200 hover:bg-slate-800"
                                                    onClick={() =>
                                                        onOpenEditMember(member)
                                                    }
                                                >
                                                    <Pencil size={14} />
                                                    Editar
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    loading={
                                                        removingMemberUserId ===
                                                        member.user?.id
                                                    }
                                                    className="h-8 border-red-500/30 bg-red-500/10 px-3 text-xs text-red-300 hover:bg-red-500/20"
                                                    onClick={() =>
                                                        onRemoveMember(member)
                                                    }
                                                >
                                                    <Trash2 size={14} />
                                                    Remover
                                                </Button>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {memberFieldErrors.role ? (
                        <p className="mt-2 text-xs text-red-400">
                            {memberFieldErrors.role}
                        </p>
                    ) : null}
                </div>
            </div>

            {isEditMemberModalOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
                    <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h5 className="text-base font-semibold text-white">
                                Editar membro
                            </h5>
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-800 hover:text-white"
                                onClick={onCloseEditMember}
                            >
                                <X size={16} />
                            </Button>
                        </div>

                        <form
                            className="space-y-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                onSaveMemberEdit();
                            }}
                            autoComplete="off"
                        >
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">
                                    Nome
                                </label>
                                <IconInput
                                    icon={User}
                                    autoComplete="off"
                                    value={editingMemberForm.name}
                                    onChange={(event) =>
                                        onChangeEditMemberField(
                                            "name",
                                            event.target.value,
                                        )
                                    }
                                    inputClassName={
                                        memberFieldErrors.name
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {memberFieldErrors.name ? (
                                    <p className="text-xs text-red-400">
                                        {memberFieldErrors.name}
                                    </p>
                                ) : null}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">
                                    E-mail
                                </label>
                                <IconInput
                                    icon={Mail}
                                    type="email"
                                    autoComplete="off"
                                    value={editingMemberForm.email}
                                    onChange={(event) =>
                                        onChangeEditMemberField(
                                            "email",
                                            event.target.value,
                                        )
                                    }
                                    inputClassName={
                                        memberFieldErrors.email
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {memberFieldErrors.email ? (
                                    <p className="text-xs text-red-400">
                                        {memberFieldErrors.email}
                                    </p>
                                ) : null}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300">
                                    Papel no workspace
                                </label>
                                <select
                                    className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-indigo-500"
                                    value={editingMemberForm.role}
                                    onChange={(event) =>
                                        onChangeEditMemberField(
                                            "role",
                                            event.target.value,
                                        )
                                    }
                                >
                                    <option value="admin">Admin</option>
                                    <option value="member">Membro</option>
                                </select>
                                {memberFieldErrors.role ? (
                                    <p className="text-xs text-red-400">
                                        {memberFieldErrors.role}
                                    </p>
                                ) : null}
                            </div>

                            <label className="flex items-center gap-2 text-sm text-slate-300">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-indigo-500"
                                    checked={Boolean(
                                        editingMemberForm.can_create_tasks,
                                    )}
                                    onChange={(event) =>
                                        onChangeEditMemberField(
                                            "can_create_tasks",
                                            event.target.checked,
                                        )
                                    }
                                    disabled={
                                        editingMemberForm.role === "admin"
                                    }
                                />
                                Permitir criação de tarefas
                            </label>
                            {memberFieldErrors.can_create_tasks ? (
                                <p className="text-xs text-red-400">
                                    {memberFieldErrors.can_create_tasks}
                                </p>
                            ) : null}

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                                    onClick={onCloseEditMember}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    loading={isSubmittingMember}
                                >
                                    Salvar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default WorkspaceMemberPanel;
