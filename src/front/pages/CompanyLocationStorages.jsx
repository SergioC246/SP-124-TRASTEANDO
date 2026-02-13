import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


export const CompanyLocationStorages = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [storages, setStorages] = useState([])
    const [loading, setLoading] = useState(true)
    const [location, setLocation] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token_company")

        if (!token) {
            navigate("/companies/login")
            return
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/api/location/${id}/storages`

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

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/location/${id}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then(res => {
                if (!response.ok) throw new Error("Error fetching location")
                return response.json()
            })
            .then(data => {
                setLocation(data)
                setLoading(false)
            })
            .catch(error => {
                console.error("Location error:", error)
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
        <div className="container-fluid py-5 px-4">
            <div className="row">
                <div className="col-12 col-xl-12 mx-auto">
                    <div className="card shadow-lg border-0">

                        <div className="card-header bg-info-subtle text-info-emphasis text-center py-4">
                            <h4 className="mb-0">
                                Storages in {location?.name}
                            </h4>
                        </div>

                        <div className="card-body bg-light">
                            <div className="row g-4">
                                {storages.map(storage => (
                                    <div key={storage.id} className="col-12 col-md-6 col-lg-3">
                                        <div className="card shadow-sm border-0 h-100">

                                            <img src="https://media.istockphoto.com/id/2161730367/fr/photo/unit%C3%A9s-dentreposage-de-location-10-par-30-pieds-location-dunit%C3%A9s-dentreposage-pour-les.jpg?s=2048x2048&w=is&k=20&c=W1mSZ3KgOXGI22pN0T3_--5Df7iTs8SpSGBZZJn4tiw="
                                                className="card-img-top"
                                                alt="Storage"
                                                style={{ height: "180px", objectFit: "cover" }}
                                            />
                                            <div className="card-body">
                                                <h5 className="fw-bold">Size: {storage.size}</h5>
                                                <p className="mb-1"><strong>Price:</strong> {storage.price}</p>
                                                <p className="mb-0"><strong>Status:</strong> {storage.status ? "Available" : "Occupied"}</p>

                                                <div className="d-flex justify-content-end gap-1 mt-2">
                                                    <button className="btn btn-md btn-outline-primary shadow"
                                                        onClick={() => navigate(`/companies/private/storages/${storage.id}`)}>
                                                        <i className="fa-regular fa-eye"></i>
                                                    </button>

                                                    <button className="btn btn-md btn-outline-success shadow"
                                                        onClick={() => navigate(`/companies/private/storages/edit/${storage.id}`)}>
                                                        <i className="fa-solid fa-pencil"></i>
                                                    </button>

                                                    <button className="btn btn-md btn-outline-danger"
                                                        onClick={() => handleDelete(storage.id)}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="card-footer bg-white border-0 py-3">
                                    <div className="d-flex flex-column align-items-center gap-3">
                                        <button className="btn btn-outline-success shadow" onClick={() => navigate("/companies/private/storages/create")}>
                                            Create Storage
                                        </button>
                                        <button className="btn btn-outline-secondary shadow" onClick={() => navigate("/companies/private/locations")}>
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}