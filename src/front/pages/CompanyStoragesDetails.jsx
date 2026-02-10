import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const CompanyStoragesDetails = () => {

    const { id } = useParams()
    const [storage, setStorage] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token_company")
        if (!token) return

        fetch(import.meta.env.VITE_BACKEND_URL + `api/private/company/storages/${id}`, {
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
        })

            .then(response => response.json())
            .then(data => {
                setStorage(data)
                setLoading(false)
            })
    }, [id])

    if (loading) return <h2>Loading storages details</h2>
    if (!storage) return <h2>No storage found</h2>


    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card show">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Detalles del Storage</h4>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <p><strong>ID:</strong> {storage.id}</p>
                                <p><strong>Size:</strong> {storage.size}</p>
                                <p><strong>Price:</strong> {storage.price}</p>
                                <p><strong>Status:</strong> {storage.status}</p>
                                <p><strong>Location ID:</strong> {storage.location_id}</p>
                                <p><strong>City:</strong> {storage.city}</p>
                                <div className="card-footer d-flex justify-content-end">
                                    <button className="btn btn-secondary" onClick={() => navigate("/companies/private/storages")}>
                                        Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};