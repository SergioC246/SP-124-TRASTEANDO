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

        const url = `${import.meta.env.VITE_BACKEND_URL}api/location/${id}/storages`

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
            .then(response => {
                if (!response.ok) throw new Error("Error fetching location")
                return response.json()
            })
            .then(async data => {
                const storagesWithLeases = await Promise.all(
                    data.map(async storage => {
                        const leasesRes = await fetch(
                            `${import.meta.env.VITE_BACKEND_URL}api/private/company/storage/${storage.id}/leases`,
                            { headers: { Authorization: "Bearer " + token } }
                        )
                        const leasesData = await leasesRes.json()
                        return { ...storage, leases: leasesData }
                    })
                )
                setStorages(storagesWithLeases)
                setLoading(false)
            })
            .catch(error => {
                console.error("Location error:", error)
                setLoading(false)
            })

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/location/${id}`, {
            headers: { Authorization: "Bearer " + token }
        })
            .then(res => {
                if (!res.ok) throw new Error("Error fetching location")
                return res.json()
            })
            .then(data => setLocation(data))
            .catch(err => console.error(err))
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
                setStorages(prev => prev.filter(storage => storage.id !== storageId)
                )
            })
    }

    if (loading) return <h2>Loading storages...</h2>

    if (storages.length === 0) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-5">
                        <div className="card shadow-lg border-0">
                            <div className="card-header bg-info-subtle text-info-emphasis text-center py-4">
                                <h3 className="mb-0">
                                    No Storages Found
                                </h3>
                            </div>
                            <div className="card-body py-4">
                                <div className="d-flex flex-column align-items-center gap-3">
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
        )
    }

    return (
        <div className="container-fluid py-5 px-4">
            <div className="row">
                <div className="col-12 col-xl-12 mx-auto">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-info-subtle text-info-emphasis text-center py-4">
                            <h4 className="mb-0">Storages in {location?.address}</h4>
                        </div>

                        <div className="card-body bg-light">
                            <div className="row g-4">
                                {storages.map(storage => {
                                    const occupancyPercentage = storage.status ? 0 : 100
                                    const statusClass = storage.status ? "text-success" : "text-danger"
                                    const occupancyLabel = storage.status ? "Available" : "Occupied"

                                    return (
                                        <div key={storage.id} className="col-12 col-md-6 col-lg-3">
                                            <div className="card shadow-sm border-0 h-100">
                                                {storage.photo ? (
                                                    <img
                                                        src={storage.photo}
                                                        className="card-img-top"
                                                        alt="Storage"
                                                        style={{ aspectRatio: "16/9", width: "100%", objectFit: "cover" }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="d-flex align-items-center justify-content-center bg-light text-muted fw-bold"
                                                        style={{ aspectRatio: "16/9", width: "100%" }}
                                                    >
                                                        No image
                                                    </div>
                                                )}

                                                <div className="card-body">
                                                    <h5 className="fw-bold">Size: {storage.size}</h5>
                                                    <p className="mb-1"><strong>Price:</strong> {storage.price}</p>
                                                    <p className={`mb-2 fw-bold ${statusClass}`}><strong>Status:</strong> {occupancyLabel}</p>

                                                    {storage.leases && (
                                                        <div className="mt-2">
                                                            <h6>Leases:</h6>
                                                            <ul className="list-unstyled mb-0">
                                                                {storage.leases.past.map(l => (
                                                                    <li key={l.id}><strong>Past:</strong> {l.client_email} ({l.start_date} - {l.end_date})</li>
                                                                ))}
                                                                {storage.leases.current.map(l => (
                                                                    <li key={l.id}><strong>Current:</strong> {l.client_email} ({l.start_date} - {l.end_date})</li>
                                                                ))}
                                                                {storage.leases.future.map(l => (
                                                                    <li key={l.id}><strong>Future:</strong> {l.client_email} ({l.start_date} - {l.end_date})</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

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
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}