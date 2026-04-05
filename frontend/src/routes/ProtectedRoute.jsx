import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ requiresManager = false }) {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiresManager && !user?.is_workspace_manager) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
