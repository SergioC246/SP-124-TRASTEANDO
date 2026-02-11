import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


export const CompanyLocationStorages = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [storages, setStorages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token_company")

        if (!token) {
            navigate("/companies/login")
            return
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/api/private/company/locations/${id}/storages`

        fetch(url, {
            headers: {
                "Authorization": "Bearer " + token,
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Error fetching storages")
                return response.json()
            })
            .then(data => {
                setStorages(data)
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            })
    }, [id])

    const handleDelete = (storageId) => {
        const token = localStorage.getItem("token_company")
        if (!token) return

        if (!window.confirm("Are you sure you want to delete this storage?")) return

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private/company/storages/${storageId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(response => {
                if (!response.ok) throw new Error("Delete failed")
                setStorages(prev =>
                    prev.filter(storage => storage.id !== storageId)
                )
            })
    }

    if (loading) return <h2>Loading storages...</h2>
    if (storages.length === 0) return <h2>No storages found for this location</h2>


    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card show">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Storages in this Location</h4>
                        </div>

                        <ul className="list-group">
                            {storages.map(storage => (
                                <li key={storage.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Size:</strong> {storage.size} <br />
                                        <strong>Price:</strong> {storage.price} <br />
                                        <strong>Status:</strong> {storage.status ? "Available" : "Occupied"}
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button  className="btn btn-sm btn-outline-primary"
                                            onClick={() => navigate(`/companies/private/storages/${storage.id}`)}
                                        >
                                            Details
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={() => navigate(`/companies/private/storages/edit/${storage.id}`)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(storage.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="card-footer">
                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() => navigate("/companies/private/storages/create")}
                                >
                                    Create Storage
                                </button>

                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => navigate("/companies/private/locations")}
                                >
                                    Back to Locations
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}