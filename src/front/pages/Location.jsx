import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteLocations, getLocations } from "./utilsLocations"

export const Location = () => {

    const [allLocation, setAllLocation] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchLocations = async () => {
            const data = await getLocations()
            setAllLocation(data || [])
        }
        fetchLocations()
    }, [])

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this location?")
        if (!confirmed) return

        const success = await deleteLocations(id)
        if (success) {
            setAllLocation(prev => prev.filter(loc => loc.id !== id))
        }
    }

    return (
        <div className="container py-4">
            <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="mb-0">Locations</h2>
                    <button className="btn btn-success" onClick={() => navigate("/location-create")}>
                        Create Location
                    </button>
                </div>

                {allLocation.map((location) =>
                    <div key={location.id} className="card mb-2">
                        <div className="card-body d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                            <div>
                                <h5 className="card-title">Company ID: {location.company_id}</h5>
                                <p className="mb-0">Address: {location.address}</p>
                                <p className="mb-0">City: {location.city}</p>
                                <p className="mb-0">Latitude: {location.latitude}</p>
                                <p className="mb-0">Longitude: {location.longitude}</p>
                                <p className="mb-0">ID: {location.id}</p>
                            </div>
                            <div className="d-flex flex-column flex-sm-row gap-1 mt-3 mt-sm-0">
                                <button className="btn btn-success" onClick={() => navigate(`/location-details/${location.id}`)}>Details</button>
                                <button className="btn btn-primary" onClick={() => navigate(`/location-edit/${location.id}`)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(location.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}
                {allLocation.length === 0 && <p>No locations found</p>}
            </div>
        </div>
    )
}
