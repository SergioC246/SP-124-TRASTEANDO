import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


export const CompanyStoragesEdit = () => {

    const { storage_id } = useParams()
    const navigate = useNavigate()

    const [size, setSize] = useState("")
    const [price, setPrice] = useState("")
    const [locationId, setLocationId] = useState("")
    const [status, setStatus] = useState(true)
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
                navigate("/companies/private/storages")
            })
            .catch(err => {
                console.error(err)
                alert("Error updating storage")
            })
    }

    if (loading) return <h2>Loading storage...</h2>

    return (
        <div className="containet py-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card show-sm">

                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Edit Storages</h4>
                        </div>

                        <div className="card-body">

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Size</label>
                                <input type="text" className="form-control" value={size} onChange={e => setSize(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Price</label>
                                <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Location ID</label>
                                <input type="number" className="form-control" value={locationId} onChange={e => setLocationId(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Status</label>
                                <select className="form-select" value={status ? "available" : "occupied"} onChange={e => setStatus(e.target.value === "available")}>
                                    <option value={true}>Available</option>
                                    <option value={false}>Occupied</option>
                                </select>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-outline-success" onClick={handleUpdate}>
                                    Edit
                                </button>
                                <button className="btn btn-outline-secondary"
                                    onClick={() => navigate("/companies/private/storages")}>
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