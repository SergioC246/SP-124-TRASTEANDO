import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const CompanyLogin = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const { store, dispatch } = useGlobalReducer()

    function sendData(e) {
        e.preventDefault()

        const requestOptions = {
            method: "POST",
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(
                {
                    "email": email,
                    "password": password
                }
            )
        }
        fetch(import.meta.env.VITE_BACKEND_URL + '/api/login/company', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.company_token) {
                    localStorage.setItem("token_company", data.company_token)

                    dispatch({
                        type: "set_auth_company",
                        payload: true
                    })

                    navigate("/companies/private")

                } else {
                    alert("Bad email or password")
                }
            })
    }

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "15px" }}>


                <h2 className="fw-bold text-primary text-center mb-4">Welcome Back</h2>

                <form onSubmit={sendData}>

                    <div className="form-floating mb-3 text-start">
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required></input>
                        <label htmlFor="email">Email address</label>
                        <div className="form-text ps-1" style={{ fontSize: '0.7rem' }}>We'll never share your email with anyone else.</div>
                    </div>

                    <div className="form-floating mb-3 text-start">
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required></input>
                        <label htmlFor="password">Password</label>
                    </div>

                    <div>
                        <button className="btn btn-primary w-100">
                            Login
                        </button>                       
                    </div>
                    <div className="text-center mt-3">
                        <small className="text-muted">Don't have an account? <span className="text-primary fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigate("/companies")}>Register here</span></small>
                    </div>
                </form>
            </div>
        </div>
    )
}