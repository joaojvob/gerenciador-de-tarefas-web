import AuthenticatedLayout from "../components/app/AuthenticatedLayout";
import { Briefcase } from "lucide-react";
import CreateWorkspaceCard from "../components/workspaces/CreateWorkspaceCard";
import WorkspaceFeedback from "../components/workspaces/WorkspaceFeedback";
import WorkspaceList from "../components/workspaces/WorkspaceList";
import { useWorkspacesPageController } from "../features/workspaces/useWorkspacesPageController";

function WorkspacesPage() {
    const {
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
    } = useWorkspacesPageController();

    const memberPanelProps = {
        memberMode,
        onChangeMemberMode: (nextMode) => {
            setMemberMode(nextMode);
        },
        memberFieldErrors,
        inviteForm,
        onChangeInviteForm: (field, value) => {
            setInviteForm((current) => ({ ...current, [field]: value }));
        },
        onSubmitInvite: handleInviteMember,
        registerMemberForm,
        onChangeRegisterMemberForm: (field, value) => {
            setRegisterMemberForm((current) => ({
                ...current,
                [field]: value,
            }));
        },
        onSubmitRegisterMember: handleRegisterMember,
        isSubmittingMember,
        isLoadingMembers,
        members,
        isEditMemberModalOpen,
        editingMemberForm,
        removingMemberUserId,
        onOpenEditMember: handleOpenMemberEditModal,
        onCloseEditMember: handleCloseMemberEditModal,
        onChangeEditMemberField: (field, value) => {
            setEditingMemberForm((current) => ({
                ...current,
                [field]: value,
            }));
        },
        onSaveMemberEdit: handleSaveMemberEdit,
        onRemoveMember: handleRemoveMember,
    };

    return (
        <AuthenticatedLayout
            title="Workspaces"
            subtitle="Crie, organize e faça a gestão dos ambientes da sua equipe."
        >
            <div className="space-y-8 pb-12">
                <WorkspaceFeedback
                    errorMessage={errorMessage}
                    successMessage={successMessage}
                />

                <CreateWorkspaceCard
                    form={form}
                    fieldErrors={workspaceFieldErrors}
                    isSubmitting={isSubmitting}
                    onChangeForm={(field, value) => {
                        setForm((current) => ({ ...current, [field]: value }));
                    }}
                    onSubmit={handleCreateWorkspace}
                />

                <div className="space-y-4">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                        <Briefcase className="text-indigo-400" size={20} />
                        Os seus Workspaces
                    </h2>

                    <WorkspaceList
                        isLoading={isLoading}
                        workspaces={workspaces}
                        expandedWorkspaceSlug={expandedWorkspaceSlug}
                        onToggleMembers={handleToggleMembers}
                        onOpenBoard={handleOpenBoard}
                        memberPanelProps={memberPanelProps}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default WorkspacesPage;
