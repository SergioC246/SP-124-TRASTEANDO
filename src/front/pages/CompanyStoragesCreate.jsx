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
                    navigate(-1)
                }
            })
            .catch(error => {
                console.error(error)
                setError("Failed to create storage")
            })
    }

    if (loading) return <h2>Loading locations...</h2>



    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-lg border-0">

                        <div className="card-header bg-info-subtle text-info-emphasis text-center py-4">
                            <h3 className="mb-0">Create New Storage</h3>
                        </div>

                        <div className="card-body py-4">

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Size</label>
                                    <input type="text" className="form-control" value={size} onChange={(e) => setSize(e.target.value)} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Price</label>
                                    <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Location</label>
                                    <select className="form-select" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                                        <option value="">Select location</option>
                                        {locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>
                                                {loc.address} - {loc.city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="card-footer bg-white border-0 py-2">
                                    <div className="d-flex flex-column align-items-center gap-3">
                                        <button type="submit" className="btn btn-outline-success shadow">
                                            Create Storage
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary shadow" onClick={() => navigate(-1)}>
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}