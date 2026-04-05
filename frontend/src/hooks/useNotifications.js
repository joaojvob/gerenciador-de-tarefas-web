import { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationsContext";

export function useNotifications() {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotifications deve ser usado dentro de NotificationsProvider",
        );
    }

    return context;
}
