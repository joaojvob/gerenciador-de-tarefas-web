import { createContext, useEffect, useMemo, useState } from "react";
import { AUTH_MODE } from "../services/http/axios";
import * as authService from "../services/auth.service";
import { clearAuthToken, getAuthToken, setAuthToken } from "../utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function bootstrapAuth() {
            const hasToken = Boolean(getAuthToken());

            if (AUTH_MODE === "token" && !hasToken) {
                setLoading(false);
                return;
            }

            try {
                const payload = await authService.me();
                setUser(payload.user ?? payload.data ?? null);
            } catch {
                setUser(null);
                if (AUTH_MODE === "token") {
                    clearAuthToken();
                }
            } finally {
                setLoading(false);
            }
        }

        bootstrapAuth();
    }, []);

    const login = async (credentials) => {
        const payload = await authService.login(credentials);

        if (AUTH_MODE === "token" && payload.token) {
            setAuthToken(payload.token);
        }

        if (payload.user) {
            setUser(payload.user);
            return payload.user;
        }

        const mePayload = await authService.me();
        const authenticatedUser = mePayload.user ?? mePayload.data ?? null;
        setUser(authenticatedUser);
        return authenticatedUser;
    };

    const register = async (payload) => {
        const response = await authService.register(payload);

        if (AUTH_MODE === "token" && response.token) {
            setAuthToken(response.token);
        }

        if (response.user) {
            setUser(response.user);
            return response.user;
        }

        return null;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            if (AUTH_MODE === "token") {
                clearAuthToken();
            }
            setUser(null);
        }
    };

    const updateAuthenticatedUser = (nextUser) => {
        setUser(nextUser ?? null);
    };

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated: Boolean(user),
            login,
            register,
            logout,
            updateAuthenticatedUser,
        }),
        [user, loading, updateAuthenticatedUser],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export { AuthContext };
