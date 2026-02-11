import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { verifyAdminToken } from "./utilsAdministrator";

export const AdminProtectedRoute = ({ children }) => {
    const { store, dispatch } = useGlobalReducer();
    const [isVerifying, setIsVerifying] = useState(true);
    const [isValid, setIsValid] = useState(false);

    // Busca el token

    useEffect(() => {
        const checkToken = async () => {
            const token = store.admin_token || localStorage.getItem("admin_token");

            if (!token) {
                setIsVerifying(false);
                setIsValid(false);
                return;
            }

            const result = await verifyAdminToken(token, dispatch);

            if (result.success) {
                setIsValid(true); //Token válido
            } else {
                setIsValid(false); //Token inválido
                localStorage.removeItem("admin_token"); // Limpiar
            }

            setIsVerifying(false);
        };

        checkToken();
    }, [store.admin_token, dispatch]);

    if (isVerifying) {
        return (
            <div className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh"}}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Verificando...</span>                
                </div>
            </div>
        );
    }
    if (!isValid) {
  
       return <Navigate to="/admin/login" replace />
    }

    // Si hay token, mostrar contenido protegido
 
    return children;
};