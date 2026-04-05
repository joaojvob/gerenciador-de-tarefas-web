import api from "./http/axios";

function extractCollection(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload?.data ?? [];
}

export async function listWorkspaces() {
    const { data } = await api.get("/api/workspaces");
    return extractCollection(data);
}

export async function createWorkspace(payload) {
    const { data } = await api.post("/api/workspaces", payload);
    return data.workspace ?? null;
}

export async function listWorkspaceMembers(workspaceSlug) {
    const { data } = await api.get(`/api/workspaces/${workspaceSlug}/members`);
    return extractCollection(data);
}

export async function inviteWorkspaceMember(workspaceSlug, payload) {
    const { data } = await api.post(
        `/api/workspaces/${workspaceSlug}/members`,
        payload,
    );

    return data.member ?? null;
}

export async function registerWorkspaceMember(workspaceSlug, payload) {
    const { data } = await api.post(
        `/api/workspaces/${workspaceSlug}/members/register`,
        payload,
    );

    return data.member ?? null;
}

export async function updateWorkspaceMemberRole(
    workspaceSlug,
    memberUserId,
    payload,
) {
    const { data } = await api.patch(
        `/api/workspaces/${workspaceSlug}/members/${memberUserId}`,
        payload,
    );

    return data.member ?? null;
}

export async function updateWorkspaceMember(
    workspaceSlug,
    memberUserId,
    payload,
) {
    return updateWorkspaceMemberRole(workspaceSlug, memberUserId, payload);
}

export async function removeWorkspaceMember(workspaceSlug, memberUserId) {
    const { data } = await api.delete(
        `/api/workspaces/${workspaceSlug}/members/${memberUserId}`,
    );

    return data;
}
