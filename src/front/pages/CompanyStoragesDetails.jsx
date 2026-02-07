import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


export const CompanyStoragesDetails = () => {

    const { id } = useParams()
    const [storage, setStorage] = useState(null)
    const [loading, setLoading] = useState(true)

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
            <h2>Detalles del Storage</h2>
            <p><strong>ID:</strong> {storage.id}</p>
            <p><strong>Size:</strong> {storage.size}</p>
            <p><strong>Price:</strong> {storage.price}</p>
            <p><strong>Status:</strong> {storage.status}</p>
            <p><strong>Location ID:</strong> {storage.location_id}</p>
            <p><strong>Company Name:</strong> {storage.company_name}</p>
            <p><strong>City:</strong> {storage.city}</p>
        </div>
    );
};