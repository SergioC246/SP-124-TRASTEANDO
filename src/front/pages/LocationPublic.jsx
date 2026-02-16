import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteLocations, getLocations } from "./utilsLocations"

export const LocationPublic = () => {

    const [allLocation, setAllLocation] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchLocations = async () => {
            const data = await getLocations()
            setAllLocation(data || [])
        }
        fetchLocations()
    }, [])

    return (
        <div className="container py-4">
            <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="mb-0">Locations</h2>
                </div>
                
                {allLocation.map((location) =>
                    <div key={location.id} className="card mb-2">
                        <div className="card-body d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                            <div>
                                <h5 className="card-title">Company Name: {location.company_name}</h5>
                                <p className="mb-0">Address: {location.address}</p>
                                <p className="mb-0">City: {location.city}</p>
                                <p className="mb-0">Latitude: {location.latitude}</p>
                                <p className="mb-0">Longitude: {location.longitude}</p>
                                <p className="mb-0">ID: {location.id}</p>
                            </div>
                            <div className="d-flex flex-column flex-sm-row gap-1 mt-3 mt-sm-0">
                                <button className="btn btn-success" onClick={() => navigate(`/location-details/${location.id}`)}>Details</button>
                            </div>
                        </div>
                    </div>
                )}
                {allLocation.length === 0 && <p>No locations found</p>}
            </div>
        </div>
    )
}
