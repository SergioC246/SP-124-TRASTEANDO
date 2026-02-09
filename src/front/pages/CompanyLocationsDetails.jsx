import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const CompanyLocationsDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [location, setLocation] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token_company")
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
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card show">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Location Details</h4>
                        </div>

                        <div className="card">
                            <div className="card-body">
                                <p><strong>ID:</strong> {location.id}</p>
                                <p><strong>Address:</strong> {location.address}</p>
                                <p><strong>City:</strong> {location.city}</p>
                                <p><strong>Latitude:</strong> {location.latitude}</p>
                                <p><strong>Longitude:</strong> {location.longitude}</p>
                                <button className="btn btn-secondary mt-0" onClick={() => navigate("/companies/private/locations")}>
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