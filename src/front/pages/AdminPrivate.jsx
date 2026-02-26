import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { verifyAdminToken, logoutAdmin } from "./utilsAdministrator";

export const AdminPrivate = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");

        if (!token) {
            console.log("❌ No hay token, redirigiendo al login...");
            navigate("/admin/login");
            return;
        }

        console.log("✅ Token encontrado, verificando con el backend...");

        verifyAdminToken(token, dispatch).then(res => {
            if (!res.success) {
                console.log("❌ Token inválido");
                navigate("/admin/login");
            } else {
                console.log("✅ Token válido, mostrando panel");
                setLoading(false);
            }
        }).catch(err => {
            console.error(err);
            setError(err.message);
            localStorage.removeItem("admin_token")
            navigate("/admin/login");
        });
    }, []);

    if (loading) return <p>Load administrator data...</p>;

    const admin = store.admin_info;

    return (
        <div className="container mt-4 mb-5">
            <h1>Admin private panel</h1>



            <div className="card mt-3">
                <div className="card-body">
                    <p><strong>Admin ID:</strong> {admin.id}</p>
                    <p><strong>Email:</strong> {admin.email}</p>
                    {admin.name && <p><strong>Nombre:</strong> {admin.name}</p>}
                </div>
                <div className="mt-4 p-3 bg-light rounded-3">
                    <small
                        className="text-muted d-block mb-1 text-uppercase fw-bold"
                        style={{ fontSize: "0.7rem" }}
                    >
                        Raw Data (Secret)
                    </small>

                    <code
                        className="text-primary"
                        style={{ fontSize: "0.8rem" }}
                    >
                        {JSON.stringify(admin)}
                    </code>
                </div>
            </div>
        </div>
    );
};