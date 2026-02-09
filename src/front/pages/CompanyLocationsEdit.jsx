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
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card show-sm">

                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0"> Edit Location</h4>
                        </div>

                        <div className="card-body">

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Address</label>
                                <input type="text" className="form-control" value={address} onChange={e => setAddress(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">City</label>
                                <input type="text" className="form-control" value={city} onChange={e => setCity(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Latitude</label>
                                <input type="text" className="form-control" value={latitude} onChange={e => setLatitude(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Longitude</label>
                                <input type="text" className="form-control" value={longitude} onChange={e => setLongitude(e.target.value)} />
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-outline-success" onClick={handleUpdate}>
                                    Edit
                                </button>

                                <button className="btn btn-outline-secondary" onClick={() => navigate("/companies/private/locations")}>
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