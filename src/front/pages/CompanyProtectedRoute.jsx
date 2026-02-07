import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const CompanyProtectedRoute = ({ children }) => {
    const { store } = useGlobalReducer();

    // Si no hay token de company, enviar al login
    if (!store.company_token) {
        console.log("CompanyProtectedRoute: No hay token de company, redirigiendo a /admin/login");
        return <Navigate to="/companies/login" replace />
    }

    // Si hay token, mostrar contenido protegido
    return children;
};