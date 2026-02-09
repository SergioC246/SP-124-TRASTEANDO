import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const ClientPrivate = () => {
    const { store, dispatch} = useGlobalReducer();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("tokenClient");
        localStorage.removeItem("client_id")
        dispatch({type: "logout_client"});
        navigate("/client-login/login")
    };

    useEffect(() => {
        const token = localStorage.getItem("tokenClient");

        if (!token){
            navigate("/client-login/login");
            return
        }

        const loadClient = async () => {        
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;

                const resp = await fetch(`${backendUrl}/api/private/client`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await resp.json();

                if (!resp.ok) {
                    localStorage.removeItem("tokenClient");
                    localStorage.removeItem("client_id")
                    dispatch({ type: "logout_client" });
                    navigate("/client-login/login");
                    return;
                }
                setClient(data);
            } catch (err) {
                setError("Network error");
            } finally {
                setLoading(false);
            }
        };
        loadClient();
    }, [store.tokenClient, dispatch, navigate]);

    if (loading) return <div className="text-center p-5">Cargando...</div>;
    if (error) return <div className="text-center p-5 alert alert-danger">{error}</div>;
    if (!client) return null;
    
    return (

        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
            <div className="card shadow-lg border-0" style={{ maxWidth: "500px", width: "100%", borderRadius: "20px", overflow: "hidden" }}>
                <div className="bg-primary p-4 text-center text-white">
                    <div className="rounded-circle bg-white d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                        <i className="bi bi-shield-lock-fill text-primary" style={{ fontSize: "2.5rem" }}></i>
                    </div>
                    <h3 className="fw-bold mb-0">Private Area</h3>
                    <p className="opacity-75 small">This information is only visible to you</p>
                </div>

                <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h5 className="text-secondary fw-bold mb-0">Client Details</h5>
                        <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">Verified Token</span>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-3">
                            <span className="text-muted"><i className="bi bi-person me-2"></i>Client ID</span>
                            <span className="fw-bold text-dark">#{client.id}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-3">
                            <span className="text-muted"><i className="bi bi-envelope me-2"></i>Email Address</span>
                            <span className="fw-bold text-dark">{client.email}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-3">
                            <span className="text-muted"><i className="bi bi-check-circle me-2"></i>Account Status</span>
                            <span className={`fw-bold ${client.is_active ? 'text-success' : 'text-danger'}`}>
                                {client.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </li>
                    </ul>

                    <div className="mt-4 p-3 bg-light rounded-3">
                        <small className="text-muted d-block mb-1 text-uppercase fw-bold" style={{ fontSize: "0.65rem" }}>Raw Data (Secret)</small>
                        <code className="text-primary" style={{ fontSize: "0.8rem" }}>{JSON.stringify(client)}</code>
                    </div>
                </div>

                <div className="card-footer bg-white border-0 p-4 pt-0">
                    <button className="btn btn-outline-danger w-100 fw-bold py-2" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-left me-2"></i>Logout from Secret Area
                    </button>
                </div>
            </div>
        </div>
    )
}