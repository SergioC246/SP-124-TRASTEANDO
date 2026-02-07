import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const CompanyPrivate = () => {

    const [company, setCompany] = useState(null)

    const navigate = useNavigate()

    const { dispatch } = useGlobalReducer()

    function handleLogout() {
        localStorage.removeItem("token_company")

        dispatch({
            type: 'set_auth_company',
            payload: false
        })

        navigate("/")
    }

    useEffect(() => {
        const token = localStorage.getItem("token_company")

        if (!token) {
            navigate("/companies/login")
            return
        }

        fetch(import.meta.env.VITE_BACKEND_URL + "api/private/company", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    navigate("/companies/login")
                }
                return response.json()
            })
            .then(data => {
                setCompany(data)
            })

    }, [])

    if (!company) {
        return <h2>Cargando</h2>
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card show">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Company Private Area</h4>
                        </div>

                        <div className="card-body">
                            <p><strong>Name:</strong> {company.name}</p>
                            <p><strong>Email:</strong> {company.email}</p>
                            <p><strong>CIF:</strong> {company.cif}</p>
                            <p><strong>Address:</strong> {company.address}</p>

                            <div className="d-flex flex-row gap-2">
                                <Link to="/companies/private/locations" className="btn btn-primary btn-sm">
                                    My Locations
                                </Link>
                                <Link to="/companies/private/storages" className="btn btn-primary btn-sm">
                                    My Storages
                                </Link>
                                <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}