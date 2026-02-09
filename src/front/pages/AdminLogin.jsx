import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminLogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");

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

            console.log("4 - Login correcto")
            localStorage.setItem("admin_token", data.admin_token);
            localStorage.setItem("admin_info", JSON.stringify(data.admin));

            console.log("5 - Actualizando estado global (dispatch)...");
           

            console.log("6 - Intentando navegar a /admin/private...")
            window.location.href = "/admin/private";

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">                    
                    <h2 className="text-center mb 4">Admin Login</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(a) => setEmail(a.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(a) => setPassword(a.target.value)}
                                required
                            />
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
                </div>
            </div>
        </div>
    );
};