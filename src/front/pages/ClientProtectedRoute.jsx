import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ClientProtectedRoute = ({ children }) => {
    const { store } = useGlobalReducer();

    const token = store.tokenClient || localStorage.getItem("tokenClient")
    // Si no hay token de company, enviar al login
    if (!token) {
         return <Navigate to="/client-login/login" replace />
    }

    // Si hay token, mostrar contenido protegido
    return children;
};