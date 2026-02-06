import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminLogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");
    
    const handleSubmit = async (a) => {
        a.preventDefaulr();
        setLoading(true);
        setError(null);

        try {
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

            if (!resp.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("admin_id", data.admin_id);

            navigate("/admin/private");

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

                        {error &&(
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};