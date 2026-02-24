import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import clientLoginImg from "../assets/img/Login-client.png";
import googleIcon from "../assets/img/googleIcon.png";
import facebookIcon from "../assets/img/facebookIcon.png"


export const ClientLogin = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (store.tokenClient) {
            const timer = setTimeout(() => {
                navigate("/client/private");
            }, 1500);
            return () => clearTimeout(timer)
        }
    }, [store.tokenClient, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const resp = await fetch(`${backendUrl}api/login/client`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await resp.json();

            if (!resp.ok) {
                setError(data.message || data.msg || "Login failed");
                return;
            }

            localStorage.setItem("tokenClient", data.token);
            localStorage.setItem("client_id", data.client_id)

            dispatch({
                type: "set_auth_client",
                payload: { tokenClient: data.token },
            });

            setTimeout(() => navigate("/search"), 1000);

        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className="row shadow-lg" style={{ borderRadius: "15px", overflow: "hidden" }}>
                <div className="col-md-6 d-none d-md-block" style={{
                    backgroundImage: `url(${clientLoginImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}>
                </div>

                <div className="col-md bg-white p-5 d-flex flex-column justify-content-center">
                    <div className="h-100 w-100 d-flex flex-column justify-content-end">
                        <h2 className="text-black fw-bold">Welcome Back</h2>
                        <div>
                            <small className="text-secondary">New here? <span className="fw-bold" style={{ cursor: 'pointer', color: "#91BBF2" }} onClick={() => navigate("/client/signup")}>Register here</span></small>
                        </div>
                    </div>

                    <h3 className="fw-bold  mb-4 text-center" style={{ color: "#5C73F2" }}>Client Login</h3>
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center p-2 mb-3" style={{ fontSize: '0.85rem' }}>
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>{error}</div>
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="mb-1" htmlFor="email">Email address</label>
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" disabled={loading} required />                            
                        </div>
                        <div className="mb-3">
                            <label className="mb-1" htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" disabled={loading} required />
                            
                            
                        </div>


                        <button type="submit" className="btn w-100 py-2 fw-bold mb-3" disabled={loading} style={{
                            backgroundColor: "#5C73F2",
                            color: "white",
                            borderRadius: "8px"
                        }}>
                            {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</> : "Login"}
                        </button>

                        <div className="d-flex flex-column gap-2">
                            <button className="btn d-flex align-items-center justify-content-center gap-2 border" style={{ backgroundColor: "#fff", color: "#333", borderRadius: "8px" }}>
                                <img src={googleIcon} alt="Google" style={{ width: "20px" }} /> Continue with Google
                            </button>
                            <button className="btn d-flex align-items-center justify-content-center gap-2 border" style={{ backgroundColor: "#1877F2", color: "#fff", borderRadius: "8px" }}>
                                <img src={facebookIcon} alt="Facebook" style={{ width: "20px" }} /> Continue with Facebook
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}