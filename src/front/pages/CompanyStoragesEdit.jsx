import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


export const CompanyStoragesEdit = () => {

    const { storage_id } = useParams()
    const navigate = useNavigate()

    const [locations, setLocations] = useState([])
    const [size, setSize] = useState("")
    const [price, setPrice] = useState("")
    const [locationId, setLocationId] = useState("")
    const [status, setStatus] = useState("true")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token_company")

        if (!token) {
            navigate("/companies/login")
            return
        }

        fetch(import.meta.env.VITE_BACKEND_URL + `api/private/company/storages/${storage_id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(response => response.json())
            .then(data => {
                setSize(data.size)
                setPrice(data.price)
                setLocationId(data.location_id)
                setStatus(data.status)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private/company/locations`, {
            headers: { Authorization: "Bearer " + token }
        })
            .then(res => res.json())
            .then(data => {
                setLocations(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])


    const handleUpdate = () => {
        const token = localStorage.getItem("token_company")

        fetch(import.meta.env.VITE_BACKEND_URL + `api/storage/${storage_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                size,
                price,
                location_id: locationId,
                status
            })
        })
            .then(response => response.json())
            .then(() => {
                navigate(-1)
            })
            .catch(err => {
                console.error(err)
                alert("Error updating storage")
            })
    }

    if (loading) return <h2>Loading storage...</h2>

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-lg border-0">

                        <div className="card-header bg-info-subtle text-info-emphasis text-center py-4">
                            <h3 className="mb-0">Edit Storage</h3>
                        </div>

                        <div className="card-body py-4">

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Size</label>
                                    <input type="text" className="form-control" value={size} onChange={e => setSize(e.target.value)} />

                                    <label className="form-label fw-semibold mt-3">Location</label>
                                    <select className="form-select" value={locationId} onChange={e => setLocationId(e.target.value)}>
                                        <option value="">Select location</option>
                                        {locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>
                                                {loc.address} - {loc.city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Price</label>
                                    <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} />

                                    <label className="form-label fw-semibold mt-3">Status</label>
                                    <select className="form-select" value={status ? "true" : "false"} onChange={e => setStatus(e.target.value === "true")}>
                                        <option value="true">Available</option>
                                        <option value="false">Occupied</option>
                                    </select>
                                </div>
                            </div>

                            <div className="card-footer bg-white border-0 py-3 d-flex justify-content-center gap-3">
                                <button className="btn btn-outline-success shadow px-4" onClick={handleUpdate}>
                                    Save
                                </button>
                                <button className="btn btn-outline-secondary shadow px-4" onClick={() => navigate(-1)}>
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