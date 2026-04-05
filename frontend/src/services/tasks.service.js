import api from "./http/axios";

function extractCollection(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }

    return payload?.data ?? [];
}

export async function listTasks(workspaceSlug) {
    const { data } = await api.get(`/api/workspaces/${workspaceSlug}/tasks`);
    return extractCollection(data);
}

export async function createTask(workspaceSlug, payload) {
    const { data } = await api.post(
        `/api/workspaces/${workspaceSlug}/tasks`,
        payload,
    );

    return data.task ?? null;
}

export async function updateTaskStatus(workspaceSlug, taskId, status) {
    const { data } = await api.patch(
        `/api/workspaces/${workspaceSlug}/tasks/${taskId}`,
        { status },
    );

    return data.task ?? null;
}
