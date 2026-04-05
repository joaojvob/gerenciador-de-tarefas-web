import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createWorkspace,
    inviteWorkspaceMember,
    listWorkspaceMembers,
    listWorkspaces,
    removeWorkspaceMember,
    registerWorkspaceMember,
    updateWorkspaceMember,
} from "../../services/workspaces.service";
import { useNotifications } from "../../hooks/useNotifications";

export function useWorkspacesPageController() {
    const navigate = useNavigate();
    const notifications = useNotifications();

    const [workspaces, setWorkspaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [expandedWorkspaceSlug, setExpandedWorkspaceSlug] = useState("");
    const [isSubmittingMember, setIsSubmittingMember] = useState(false);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [members, setMembers] = useState([]);
    const [memberMode, setMemberMode] = useState("invite");

    const [form, setForm] = useState({ name: "", description: "" });
    const [workspaceFieldErrors, setWorkspaceFieldErrors] = useState({});

    const [memberFieldErrors, setMemberFieldErrors] = useState({});
    const [inviteForm, setInviteForm] = useState({ email: "" });
    const [registerMemberForm, setRegisterMemberForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [editingMemberForm, setEditingMemberForm] = useState({
        name: "",
        email: "",
        role: "member",
        can_create_tasks: false,
    });
    const [removingMemberUserId, setRemovingMemberUserId] = useState(null);

    useEffect(() => {
        loadWorkspaces();
    }, []);

    async function loadWorkspaces() {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const payload = await listWorkspaces();
            setWorkspaces(payload);
        } catch (error) {
            const message =
                error?.response?.data?.message ??
                "Não foi possível carregar os workspaces.";

            setErrorMessage(message);
            notifications.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreateWorkspace(event) {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setWorkspaceFieldErrors({});

        const localErrors = {};
        if (!form.name.trim()) {
            localErrors.name = "Informe o nome do workspace.";
        }

        if (Object.keys(localErrors).length) {
            setWorkspaceFieldErrors(localErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            await createWorkspace(form);
            setSuccessMessage("Workspace criado com sucesso.");
            notifications.success("Workspace criado com sucesso.");
            setForm({ name: "", description: "" });
            await loadWorkspaces();
        } catch (error) {
            const apiErrors = error?.response?.data?.errors;
            const firstError = apiErrors
                ? Object.values(apiErrors)?.[0]?.[0]
                : null;

            if (apiErrors) {
                setWorkspaceFieldErrors({
                    name: apiErrors.name?.[0],
                    description: apiErrors.description?.[0],
                });
            }

            const message =
                firstError ??
                error?.response?.data?.message ??
                "Não foi possível criar o workspace.";

            setErrorMessage(message);
            notifications.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleOpenBoard(workspaceSlug) {
        localStorage.setItem("active_workspace_slug", workspaceSlug);
        navigate(`/tasks?workspace=${workspaceSlug}`);
    }

    async function handleToggleMembers(workspaceSlug) {
        if (expandedWorkspaceSlug === workspaceSlug) {
            setExpandedWorkspaceSlug("");
            setMembers([]);
            setMemberFieldErrors({});
            return;
        }

        setExpandedWorkspaceSlug(workspaceSlug);
        setIsEditMemberModalOpen(false);
        setEditingMemberId(null);
        setMemberFieldErrors({});
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoadingMembers(true);

        try {
            const payload = await listWorkspaceMembers(workspaceSlug);
            setMembers(payload);
        } catch (error) {
            const message =
                error?.response?.data?.message ??
                "Não foi possível carregar os membros do workspace.";

            setErrorMessage(message);
            notifications.error(message);
        } finally {
            setIsLoadingMembers(false);
        }
    }

    async function handleInviteMember(event) {
        event.preventDefault();
        setMemberFieldErrors({});
        setErrorMessage("");
        setSuccessMessage("");

        const localErrors = {};
        if (!inviteForm.email.trim()) {
            localErrors.email = "Informe o e-mail do membro.";
        }

        if (Object.keys(localErrors).length) {
            setMemberFieldErrors(localErrors);
            return;
        }

        setIsSubmittingMember(true);

        try {
            await inviteWorkspaceMember(expandedWorkspaceSlug, inviteForm);
            setInviteForm({ email: "" });
            setSuccessMessage("Membro adicionado com sucesso.");
            notifications.success("Membro adicionado com sucesso.");

            const payload = await listWorkspaceMembers(expandedWorkspaceSlug);
            setMembers(payload);
        } catch (error) {
            const apiErrors = error?.response?.data?.errors;
            if (apiErrors) {
                setMemberFieldErrors({
                    email: apiErrors.email?.[0],
                });
            }

            const message =
                error?.response?.data?.message ??
                "Não foi possível adicionar o membro.";

            setErrorMessage(message);
            notifications.error(message);
        } finally {
            setIsSubmittingMember(false);
        }
    }

    async function handleRegisterMember(event) {
        event.preventDefault();
        setMemberFieldErrors({});
        setErrorMessage("");
        setSuccessMessage("");

        const localErrors = {};

        if (!registerMemberForm.name.trim()) {
            localErrors.name = "Informe o nome do membro.";
        }

        if (!registerMemberForm.email.trim()) {
            localErrors.email = "Informe o e-mail do membro.";
        }

        if (!registerMemberForm.password) {
            localErrors.password = "Informe uma senha inicial.";
        }

        if (
            registerMemberForm.password &&
            registerMemberForm.password.length < 8
        ) {
            localErrors.password = "A senha deve ter no mínimo 8 caracteres.";
        }

        if (
            registerMemberForm.password !==
            registerMemberForm.password_confirmation
        ) {
            localErrors.password_confirmation = "As senhas não conferem.";
        }

        if (Object.keys(localErrors).length) {
            setMemberFieldErrors(localErrors);
            return;
        }

        setIsSubmittingMember(true);

        try {
            await registerWorkspaceMember(
                expandedWorkspaceSlug,
                registerMemberForm,
            );

            setRegisterMemberForm({
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
            });

            setSuccessMessage("Conta criada e membro vinculado com sucesso.");
            notifications.success(
                "Conta criada e membro vinculado com sucesso.",
            );

            const payload = await listWorkspaceMembers(expandedWorkspaceSlug);
            setMembers(payload);
        } catch (error) {
            const apiErrors = error?.response?.data?.errors;
            if (apiErrors) {
                setMemberFieldErrors({
                    name: apiErrors.name?.[0],
                    email: apiErrors.email?.[0],
                    password: apiErrors.password?.[0],
                    password_confirmation: apiErrors.password_confirmation?.[0],
                });
            }

            const message =
                error?.response?.data?.message ??
                "Não foi possível cadastrar o membro.";

            setErrorMessage(message);
            notifications.error(message);
        } finally {
            setIsSubmittingMember(false);
        }
    }

    function handleOpenMemberEditModal(member) {
        if (!member?.user?.id || member.role === "owner") {
            return;
        }

        setEditingMemberId(member.user.id);
        setEditingMemberForm({
            name: member.user?.name ?? "",
            email: member.user?.email ?? "",
            role: member.role ?? "member",
            can_create_tasks: Boolean(member.permissions?.can_create_tasks),
        });
        setMemberFieldErrors({});
        setIsEditMemberModalOpen(true);
    }

    function handleCloseMemberEditModal() {
        setIsEditMemberModalOpen(false);
        setEditingMemberId(null);
        setEditingMemberForm({
            name: "",
            email: "",
            role: "member",
            can_create_tasks: false,
        });
        setMemberFieldErrors({});
    }

    async function handleSaveMemberEdit() {
        if (!expandedWorkspaceSlug || !editingMemberId) {
            return;
        }

        setMemberFieldErrors({});
        setErrorMessage("");
        setSuccessMessage("");

        const localErrors = {};

        if (!editingMemberForm.name.trim()) {
            localErrors.name = "Informe o nome do membro.";
        }

        if (!editingMemberForm.email.trim()) {
            localErrors.email = "Informe o e-mail do membro.";
        }

        if (Object.keys(localErrors).length) {
            setMemberFieldErrors(localErrors);
            return;
        }

        setIsSubmittingMember(true);

        try {
            await updateWorkspaceMember(
                expandedWorkspaceSlug,
                editingMemberId,
                {
                    name: editingMemberForm.name.trim(),
                    email: editingMemberForm.email.trim(),
                    role: editingMemberForm.role,
                    permissions: {
                        can_create_tasks:
                            editingMemberForm.role === "admin"
                                ? true
                                : Boolean(editingMemberForm.can_create_tasks),
                    },
                },
            );

            const payload = await listWorkspaceMembers(expandedWorkspaceSlug);
            setMembers(payload);
            handleCloseMemberEditModal();
            notifications.success("Membro atualizado com sucesso.");
        } catch (error) {
            const apiErrors = error?.response?.data?.errors;
            if (apiErrors) {
                setMemberFieldErrors({
                    role: apiErrors.role?.[0],
                    name: apiErrors.name?.[0],
                    email: apiErrors.email?.[0],
                    can_create_tasks:
                        apiErrors["permissions.can_create_tasks"]?.[0],
                });
            }

            notifications.error(
                error?.response?.data?.message ??
                    "Não foi possível atualizar o membro.",
            );
        } finally {
            setIsSubmittingMember(false);
        }
    }

    async function handleRemoveMember(member) {
        if (!expandedWorkspaceSlug || !member?.user?.id) {
            return;
        }

        const confirmed = globalThis.confirm(
            `Remover ${member.user?.name ?? member.user?.email ?? "este membro"} da equipe?`,
        );

        if (!confirmed) {
            return;
        }

        setRemovingMemberUserId(member.user.id);
        setMemberFieldErrors({});
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await removeWorkspaceMember(expandedWorkspaceSlug, member.user.id);

            const payload = await listWorkspaceMembers(expandedWorkspaceSlug);
            setMembers(payload);

            if (editingMemberId === member.user.id) {
                handleCloseMemberEditModal();
            }

            notifications.success("Membro removido com sucesso.");
        } catch (error) {
            const message =
                error?.response?.data?.message ??
                "Não foi possível remover o membro.";

            setErrorMessage(message);
            notifications.error(message);
        } finally {
            setRemovingMemberUserId(null);
        }
    }

    return {
        workspaces,
        isLoading,
        isSubmitting,
        errorMessage,
        successMessage,
        expandedWorkspaceSlug,
        isSubmittingMember,
        isLoadingMembers,
        members,
        memberMode,
        form,
        workspaceFieldErrors,
        memberFieldErrors,
        inviteForm,
        registerMemberForm,
        isEditMemberModalOpen,
        editingMemberForm,
        removingMemberUserId,
        setMemberMode,
        setForm,
        setInviteForm,
        setRegisterMemberForm,
        setEditingMemberForm,
        handleCreateWorkspace,
        handleOpenBoard,
        handleToggleMembers,
        handleInviteMember,
        handleRegisterMember,
        handleOpenMemberEditModal,
        handleCloseMemberEditModal,
        handleSaveMemberEdit,
        handleRemoveMember,
    };
}
