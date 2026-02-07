import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AdminProtectedRoute = ({ children }) => {
    const { store } = useGlobalReducer();

    // Si no hay token de admin, enviar al login
    if (!store.admin_token) {
        console.log("AdminProtectedRoute: No hay token de admin, redirigiendo a /admin/login");
        return <Navigate to="/admin/login" replace />
    }

    // Si hay token, mostrar contenido protegido
    return children;
};