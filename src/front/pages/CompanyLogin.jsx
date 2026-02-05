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
                    localStorage.setItem("token", data.company_token)

                    dispatch({
                        type: "set_auth",
                        payload: true
                    })

                    navigate("/companies/private")

                } else {
                    alert("Bad email or password")
                }
            })
    }

    return (
        <div className="container py-4">
            <h2 className="text-center">Login</h2>
            <form className="w-50 mx-auto" onSubmit={sendData}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required></input>
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-success">
                        Login
                    </button>
                    <button type="button" className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
                <p className="mt-2">You dont have an account? <Link to="/companies">Companies</Link></p>
            </form>
        </div>
    )
}