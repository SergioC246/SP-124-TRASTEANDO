import { useEffect, useState } from "react"

export const CompanyLocations = () => {

    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token_company")
        if (!token) return

        fetch(import.meta.env.VITE_BACKEND_URL + "/private/company/locations", {
            headers: {
                "Authorization": "Bearer " + token,
            },
        })
            .then(response => response.json())
            .then(data => {
                setLocations(data);
                setLoading(false)
            })

    }, [])

    if (loading) return <h2>Loading locations...</h2>;
    if (locations.length === 0) return <h2>No locations found</h2>

    return (
    <div className="container py-4">
      <h2>Mis Locations</h2>
      <ul className="list-group">
        {locations.map(location => (
          <li key={location.id} className="list-group-item">
            <strong>Address:</strong> {location.address} <br />
            <strong>City:</strong> {location.city}
          </li>
        ))}
      </ul>
    </div>
  );
};