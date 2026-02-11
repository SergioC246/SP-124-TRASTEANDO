import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AdminLogin = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (store.admin_token) {
            const timer = setTimeout(() => {
                navigate("/admin/private");
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [store.admin_token, navigate]);

    const handleSubmit = async (a) => {
        a.preventDefault();
        console.log("1 - Botón pulsado..")
        setLoading(true);
        setError(null);

        try {
            console.log("2 - Enviando a back..")
            const resp = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/login/admin`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await resp.json();
            console.log("3 - Respuesta recibida", data)

            if (!resp.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("admin_token", data.admin_token);
            localStorage.setItem("admin_id", data.admin_id);

            dispatch({
                type: "set_auth_admin",
                payload: {
                    token: data.admin_token,
                    admin: data.admin
                }
            });

            setTimeout(() => {
                navigate("/admin/private");
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "15px" }}>

                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Welcome Back</h2>
                </div>
                <div className="text-center mb-3">
                    <div className={`badge ${store.admin_token ?
                        "bg-success-subtle text-success" : "bg-warning-subtle text-warning"} p-2`}>
                        {store.admin_token ? "● Online" : "● Offline - Please log in"}
                    </div>
                </div>
                {!store.admin_token ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label"></label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(a) => setEmail(a.target.value)}
                                placeholder="Email address"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label"></label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(a) => setPassword(a.target.value)}
                                placeholder="Password"
                                disabled={loading}
                                required
                            />
                            <div className="form-text ps-1" style={{ fontSize: '0.7rem' }}>
                                We'll never share your email or password with anyone else
                            </div>

                        </div>

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-100 mt-2"
                            disabled={loading}
                        >
                            {loading ? "Loging in..." : "Login"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-4">
                        <div className="spinner-border text-success mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted">Redirecting to admin panel...</p>
                    </div>

                )}
            </div>
        </div>
    );
};