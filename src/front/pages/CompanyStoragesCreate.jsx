import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


export const CompanyStoragesCreate = () => {

    const [locations, setLocations] = useState([])
    const [size, setSize] = useState("")
    const [price, setPrice] = useState("")
    const [locationId, setLocationId] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token_company")
        if (!token) {
            navigate("/companies/login")
            return
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private/company/locations`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(response => response.json())
            .then(data => {
                setLocations(data)
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setError("Failed to load locations")
                setLoading(false)
            })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token_company")
        if (!token) return

        if (!size || !price || !locationId) {
            setError("All fields are required")
            return
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private/company/storages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                size,
                price,
                location_id: locationId
            })
        })

            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    setError(data.message)
                } else {
                    navigate("/companies/private/storages")
                }
            })
            .catch(error => {
                console.error(error)
                setError("Failed to create storage")
            })
    }

    if (loading) return <h2>Loading locations...</h2>



    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Create Storage</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Size</label>
                                    <input type="text" className="form-control"
                                        value={size}
                                        onChange={(e) => setSize(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Location</label>
                                    <select
                                        className="form-select"
                                        value={locationId}
                                        onChange={(e) => setLocationId(e.target.value)}
                                    >
                                        <option value="">Select location</option>
                                        {locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>
                                                {loc.address} - {loc.city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="d-flex justify-content-end gap-2">
                                    <button type="submit" className="btn btn-success btn-sm">
                                        Create Storage
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => navigate("/companies/private/storages")}
                                    >
                                        Back
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}