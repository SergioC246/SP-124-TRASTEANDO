import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import {verifyAdminToken, logoutAdmin } from "../utilsAdminisatrator";

export const AdminPrivate = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useContext(Context);

    const [loading, setLoading] = useState(true);
   
    useEffect(() => {
        const token = store.admin_token;

        if (!token) {
            navigate("/admin/login");
            return;
        }

        verifyAdminToken(token, dispatch).then(res => {
                if (!res.ok) {
                    navigate("/admin/login");
                } else {
                setLoading(false);
                }
            });
    }, []);

    const handleLogout = () => {
        logoutAdmin(dispatch);
        navigate("/admin/login");
    };

    if (loading) return <p>Load administrator data...</p>;

    const admin = store.admin_info;

    return (
        <div className="container mt-4">
            <h1>Admin private panel</h1>

            <button className="btn btn-danger mb-3" onClick={handleLogout}>
                Logout
            </button>

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