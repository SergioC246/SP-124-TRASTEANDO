import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export const CompanyLocations = () => {

  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token_company")

    if (!token) {
      navigate("/companies/login")
      return
    }

    const url = `${import.meta.env.VITE_BACKEND_URL}private/company/locations`

    fetch(url, {
      headers: {
        "Authorization": "Bearer " + token,
      },
    })
      .then(response => response.json())
      .then(data => {
        setLocations(data);
        setLoading(false)
      })
      .catch(error => {
        console.error(error)
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