import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export const CompanyStorages = () => {

    const [storages, setStorages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token_company");
        if (!token) return;

        fetch(import.meta.env.VITE_BACKEND_URL + "/private/company/storages", {
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

    if (loading) return <h2>Loading storages</h2>
    if (storages.length === 0) return <h2>No storages found</h2>

    return (
        <div className="container py-4">
            <h2>My Storages</h2>
            <ul className="list-group">
                {storages.map(storage => (
                    <li key={storage.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Size:</strong> {storage.size} <br />
                            <strong>Price:</strong> {storage.price} <br />
                            <strong>Status:</strong> {storage.status}
                        </div>
                        <Link to={`/companies/private/storages/${storage.id}`} className="btn btn-sm btn-primary">
                            Ver Detalles
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}