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

    const url = `${import.meta.env.VITE_BACKEND_URL}api/private/company/locations`

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
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card show">
            <div className="card-header justify-content-between d-flex bg-primary text-white">
              <div>
                <h4 className="mb-0">My Locations</h4>
              </div>
              <button className="btn btn-success btn-sm" onClick={() => navigate("/companies/private/locations/create")}>Create Location</button>
            </div>
            <ul className="list-group">
              {locations.map(location => (
                <li
                  key={location.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>Address:</strong> {location.address} <br />
                    <strong>City:</strong> {location.city}
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/companies/private/locations/${location.id}`)}>
                      Details
                    </button>

                    <button className="btn btn-sm btn-outline-warning"
                      onClick={() => navigate(`/companies/private/locations/edit/${location.id}`)}>
                      Edit
                    </button>

                    <button className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(location.id)}>
                      Delete
                    </button>
                  </div>
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
  );
};