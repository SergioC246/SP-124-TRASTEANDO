import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ClientProtectedRoute = ({ children }) => {
    const { store } = useGlobalReducer();

    // Si no hay token de company, enviar al login
    if (!store.client_token) {
        console.log("ClientProtectedRoute: No hay token de client, redirigiendo a /admin/login");
        return <Navigate to="/client/login" replace />
    }

    // Si hay token, mostrar contenido protegido
    return children;
};