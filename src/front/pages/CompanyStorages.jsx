import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export const CompanyStorages = () => {

    const [storages, setStorages] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token_company");
        if (!token) return;

        const url = `${import.meta.env.VITE_BACKEND_URL}api/private/company/storages`

        fetch(url, {
            headers: {
                "Authorization": "Bearer " + token,
            }
        })
            .then(response => response.json())
            .then(data => {
                setStorages(data);
                setLoading(false);
            })
    }, [])

    if (loading) return <h2>Loading storages...</h2>
    if (storages.length === 0) return <h2>No storages found</h2>

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card show">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">My Storages</h4>
                        </div>
                        <ul className="list-group">
                            {storages.map(storage => (
                                <li key={storage.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Size:</strong> {storage.size} <br />
                                        <strong>Price:</strong> {storage.price} <br />
                                        <strong>Status:</strong> {storage.status}
                                    </div>
                                    <Link to={`/companies/private/storages/${storage.id}`} className="btn btn-sm btn-success">
                                        Details
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="card-footer text-end">
                            <button className="btn btn-sm btn-secondary" onClick={() => navigate("/companies/private")}>
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}