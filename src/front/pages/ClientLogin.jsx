import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


export const ClientLogin = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLogged, setIsLogged] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLogged(!!token);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const resp = await fetch(`${backendUrl}/api/login/client`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await resp.json();

            if (!resp.ok) {
                setError(data.message || data.msg || "Login failed");
                return;
            }
            // para guardar el token
            localStorage.setItem("token", data.token);
            setIsLogged(true);

            navigate("/client/private");
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "15px" }}>

                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-primary">Welcome Back</h2>
                        <div className={`badge ${isLogged ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} p-2 mt-2`}>
                            {isLogged ? "● Online" : "● Offline - Please log in"}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
    
                        <div className="form-floating mb-3 text-start">
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" disabled={loading} required />
                            <label htmlFor="email">Email address</label>
                            <div className="form-text ps-1" style={{ fontSize: '0.7rem' }}>We'll never share your email with anyone else.</div>
                        </div>
                        <div className="form-floating mb-3 text-start">
                            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" disabled={loading} required />
                            <label htmlFor="password">Password</label>
                        </div>
                        {error && (
                            <div className="alert alert-danger d-flex align-items-center p-2 mb-3" style={{ fontSize: '0.85rem' }}>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                <div>{error}</div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={loading} style={{ borderRadius: "8px" }}>
                            {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</> : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}