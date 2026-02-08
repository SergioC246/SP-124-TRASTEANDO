import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ClientProtectedRoute = ({ children }) => {
    const { store } = useGlobalReducer();

    // Buscamos el token en el store O en el localStorage
    const token = store.tokenClient || localStorage.getItem("tokenClient");

    

    if (!token) {
        return <Navigate to="/client-login/login" replace />;
    }

    return children;
};