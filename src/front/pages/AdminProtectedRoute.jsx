import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AdminProtectedRoute = ({ children }) => {
    const { store } = useGlobalReducer();

    // Busca el token

    const tokenStore = store.admin_token;
    const tokenLocal = localStorage.getItem("admin_token");

    // Si no hay token de admin, enviar al login

    if (!tokenStore && !tokenLocal) {
       return <Navigate to="/admin/login" replace />
    }

    // Si hay token, mostrar contenido protegido
 
    return children;
};