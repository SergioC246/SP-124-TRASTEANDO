import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const CompanyLocationsDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [location, setLocation] = useState(null)
    const [loading, setLoading] = useState(true)

    const getAvailableToken = () => {
        return localStorage.getItem("token_company") || localStorage.getItem("admin_token");
    }

    useEffect(() => {
        const token = getAvailableToken();

        if (!token) return

        fetch(import.meta.env.VITE_BACKEND_URL + `api/private/company/locations/${id}`, {
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
        })

            .then(response => response.json())
            .then(data => {
                setLocation(data)
                setLoading(false)
            })
    }, [id])

    if (loading) return <h2>Loading location...</h2>
    if (!location) return <h2>Location not found</h2>

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">

                    <div className="card shadow-lg border-0">

                        <div className="card-header bg-info-subtle text-info-emphasis text-center py-3">
                            <h3 className="mb-0">
                                Location Details
                            </h3>
                        </div>

                        <div className="card-body py-4">
                            <div className="mb-3">
                                <p className="text-muted mb-1">ID:</p>
                                <p className="fw-semibold fs-5 mb-0">{location.id}</p>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <p className="text-muted mb-1">Address:</p>
                                    <p className="fw-semibold fs-5 mb-0">{location.address}</p>
                                </div>

                                <div className="col-md-6 mb-4">
                                    <p className="text-muted mb-1">City:</p>
                                    <p className="fw-semibold fs-5 mb-0">{location.city}</p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <p className="text-muted mb-1">Latitude:</p>
                                    <p className="fw-semibold fs-5 mb-0">{location.latitude}</p>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <p className="text-muted mb-1">Longitude:</p>
                                    <p className="fw-semibold fs-5 mb-0">{location.longitude}</p>
                                </div>
                            </div>

                            <div className="card-footer bg-white border-0 py-3 text-center">
                                <button className="btn btn-outline-secondary shadow px-4" onClick={() => navigate("/companies/private/locations")}>
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}