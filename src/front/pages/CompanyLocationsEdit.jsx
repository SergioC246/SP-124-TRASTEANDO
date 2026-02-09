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

        fetch(`${import.meta.env.VITE_BACKEND_URL}/private/company/locations/${location_id}`, {
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

        fetch(`${import.meta.env.VITE_BACKEND_URL}/private/company/locations/${location_id}`, {
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
        <div className="container py-4">
            <div className="col-md-6 mx-auto">
                <h2>Edit Location</h2>

                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                        className="form-control"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">City</label>
                    <input
                        className="form-control"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Latitude</label>
                    <input
                        className="form-control"
                        value={latitude}
                        onChange={e => setLatitude(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Longitude</label>
                    <input
                        className="form-control"
                        value={longitude}
                        onChange={e => setLongitude(e.target.value)}
                    />
                </div>

                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-warning"
                        onClick={handleUpdate}
                    >
                        Update
                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/companies/private/locations")}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}