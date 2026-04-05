import { createContext, useCallback, useMemo, useState } from "react";

const NotificationContext = createContext();

const variants = {
    success: {
        container: "border-emerald-800 bg-emerald-950/90",
        title: "text-emerald-300",
        message: "text-emerald-200/90",
    },
    error: {
        container: "border-red-800 bg-red-950/90",
        title: "text-red-300",
        message: "text-red-200/90",
    },
    info: {
        container: "border-indigo-800 bg-indigo-950/90",
        title: "text-indigo-300",
        message: "text-indigo-200/90",
    },
};

export function NotificationsProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications((current) => current.filter((item) => item.id !== id));
    }, []);

    const pushNotification = useCallback(
        (payload) => {
            const id =
                globalThis.crypto?.randomUUID?.() ??
                `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

            const item = {
                id,
                title: payload.title ?? "Notificação",
                message: payload.message ?? "",
                type: payload.type ?? "info",
                duration: payload.duration ?? 4000,
            };

            setNotifications((current) => [...current, item]);

            if (item.duration > 0) {
                setTimeout(() => {
                    removeNotification(id);
                }, item.duration);
            }
        },
        [removeNotification],
    );

    const notify = useMemo(
        () => ({
            success(message, title = "Sucesso") {
                pushNotification({ type: "success", title, message });
            },
            error(message, title = "Erro") {
                pushNotification({
                    type: "error",
                    title,
                    message,
                    duration: 5000,
                });
            },
            info(message, title = "Informação") {
                pushNotification({ type: "info", title, message });
            },
            custom(payload) {
                pushNotification(payload);
            },
        }),
        [pushNotification],
    );

    const value = useMemo(
        () => ({
            notifications,
            removeNotification,
            ...notify,
        }),
        [notifications, notify, removeNotification],
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}

            <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
                {notifications.map((notification) => {
                    const variant =
                        variants[notification.type] ?? variants.info;

                    return (
                        <article
                            key={notification.id}
                            className={`pointer-events-auto rounded-md border p-3 shadow-lg backdrop-blur ${variant.container}`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p
                                        className={`text-sm font-semibold ${variant.title}`}
                                    >
                                        {notification.title}
                                    </p>
                                    <p
                                        className={`mt-1 text-sm ${variant.message}`}
                                    >
                                        {notification.message}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="text-xs text-slate-300 hover:text-white"
                                    onClick={() =>
                                        removeNotification(notification.id)
                                    }
                                >
                                    Fechar
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </NotificationContext.Provider>
    );
}

export { NotificationContext };
