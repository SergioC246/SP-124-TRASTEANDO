import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminPrivate = () => {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/admin/login");
            return;
        }

        fetch(import.meta.env.VITE_BACKEND_URL + "/api/private/admin", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Token is not valid");
                }
                return res.json();
            })
            .then(data => {
                setAdmin(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                localStorage.removeItem("token")
                navigate("admin/login");
            });
    }, []);

    if (loading) return <p>Load administrator data...</p>;

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-4">
            <h1>Admin private panel</h1>

            <button className="btn btn-danger mb-3"
                onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("admin_id");
                    navigate("/admin/login");
                }}
            >
                Logout
            </button>

            <div className="card mt-3">
                <div className="card-body">
                    <p><strong>ID:</strong> {admin.id}</p>
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