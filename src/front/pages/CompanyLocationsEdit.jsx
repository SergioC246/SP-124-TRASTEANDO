import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


export const CompanyLocationsEdit = () => {

    const { location_id } = useParams()
    const navigate = useNavigate()

    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token_company")

        if (!token) {
            navigate("/companies/login")
            return
        }

        fetch(import.meta.env.VITE_BACKEND_URL + `api/private/company/locations/${location_id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(resp => resp.json())
            .then(data => {
                setAddress(data.address)
                setCity(data.city)
                setLatitude(data.latitude)
                setLongitude(data.longitude)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])


    const handleUpdate = () => {
        const token = localStorage.getItem("token_company")

        fetch(import.meta.env.VITE_BACKEND_URL + `api/private/company/locations/${location_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                address,
                city,
                latitude,
                longitude
            })
        })
            .then(response => response.json())
            .then(() => {
                navigate("/companies/private/locations")
            })
            .catch(err => {
                console.error(err)
                alert("Error updating location")
            })
    }

    if (loading) return <h2>Loading location...</h2>

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">

                    <div className="card shadow-lg border-0">

                        {/* Header */}
                        <div className="card-header bg-info-subtle text-info-emphasis text-center py-4">
                            <h3 className="mb-0">Edit Location</h3>
                        </div>

                        <div className="card-body py-4">
                            
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Address</label>
                                    <input type="text" className="form-control" value={address} onChange={e => setAddress(e.target.value)} />
                                    <label className="form-label fw-semibold mt-3">Latitude</label>
                                    <input type="text" className="form-control" value={latitude} onChange={e => setLatitude(e.target.value)} />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">City</label>
                                    <input type="text" className="form-control" value={city} onChange={e => setCity(e.target.value)} />
                                    <label className="form-label fw-semibold mt-3">Longitude</label>
                                    <input type="text" className="form-control" value={longitude} onChange={e => setLongitude(e.target.value)} />
                                </div>
                            </div>

                            <div className="card-footer bg-white border-0 py-3 d-flex justify-content-center gap-3">
                                <button className="btn btn-outline-success shadow px-4" onClick={handleUpdate}>
                                    Save
                                </button>
                                <button className="btn btn-outline-secondary shadow px-4" onClick={() => navigate("/companies/private/locations")}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}