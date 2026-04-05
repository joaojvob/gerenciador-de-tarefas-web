import { Briefcase, Loader2 } from "lucide-react";
import WorkspaceCard from "./WorkspaceCard";

function WorkspaceList({
    isLoading,
    workspaces,
    expandedWorkspaceSlug,
    onToggleMembers,
    onOpenBoard,
    memberPanelProps,
}) {
    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!workspaces.length) {
        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 py-12 text-center">
                <Briefcase className="mx-auto mb-3 h-12 w-12 text-slate-600" />
                <p className="text-slate-400">Nenhum workspace encontrado.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {workspaces.map((workspace) => (
                <WorkspaceCard
                    key={workspace.slug}
                    workspace={workspace}
                    isExpanded={expandedWorkspaceSlug === workspace.slug}
                    onToggleMembers={onToggleMembers}
                    onOpenBoard={onOpenBoard}
                    memberPanelProps={memberPanelProps}
                />
            ))}
        </div>
    );
}

export default WorkspaceList;
