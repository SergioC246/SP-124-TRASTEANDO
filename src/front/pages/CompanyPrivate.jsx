import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const CompanyPrivate = () => {

    const [company, setCompany] = useState(null)
    const [photo, setPhoto] = useState("")

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
                setPhoto(data.photo || "")
            })

    }, [])

    if (!company) {
        return <h2 className="text-center mt-5">Cargando...</h2>
    }

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-lg border-0">

                        <div className="card-header bg-info-subtle text-info-emphasis text-center py-4">
                            <h2 className="mb-0">
                                Welcome {company.name}
                            </h2>
                        </div>

                        <div className="card-body text-center">
                            <img src={photo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbFBTwnuqabNGj5FCDXwiuGK_AtPM8IlQN-g&s"}
                                alt="Company"
                                className="rounded-circle mb-4 shadow-sm"
                                style={{ width: "150px", height: "150px", objectFit: "cover" }} />

                            <div className="text-start px-3">

                                <p className="mb-2">
                                    <strong>Email:</strong><br />
                                    <span className="text-muted">{company.email}</span>
                                </p>

                                <p className="mb-2">
                                    <strong>CIF:</strong><br />
                                    <span className="text-muted">{company.cif}</span>
                                </p>

                                <p className="mb-0">
                                    <strong>Address:</strong><br />
                                    <span className="text-muted">{company.address}</span>
                                </p>

                            </div>
                        </div>

                        <div className="card-footer bg-white border-0 py-3">

                            <div className="d-grid gap-3 px-4">

                                <Link to="/companies/private/locations" className="btn btn-outline-primary btn-lg shadow">
                                    My Locations
                                </Link>

                                <button className="btn btn-outline-danger btn-lg shadow" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}