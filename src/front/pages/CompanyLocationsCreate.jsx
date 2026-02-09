import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const CompanyLocationsCreate = () => {

    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const navigate = useNavigate()

    const handleCreate = () => {
        const token = localStorage.getItem("token_company")
        if (!token) {
            navigate("/companies/login")
            return
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private/company/locations`, {
            method: "POST",
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
            .catch(error => {
                console.error(error)
                alert("Error creating location")
            })
    }

    return (
        <div className="container py-4">
            <div className="col-md-6 mx-auto">
                <h2>Create Location</h2>

                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input className="form-control" value={address} onChange={e => setAddress(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">City</label>
                    <input className="form-control" value={city} onChange={e => setCity(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Latitude</label>
                    <input className="form-control" value={latitude} onChange={e => setLatitude(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Longitude</label>
                    <input className="form-control" value={longitude} onChange={e => setLongitude(e.target.value)} />
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={handleCreate}>
                        Create
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate("/companies/private/locations")}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}