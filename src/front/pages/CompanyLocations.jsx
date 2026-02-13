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

    const url = `${import.meta.env.VITE_BACKEND_URL}/api/private/company/locations`

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

  const handleDelete = (locationId) => {
    const token = localStorage.getItem("token_company")
    if (!token) return

    if (!window.confirm("Are you sure you want to delete this location?")) return

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private/company/locations/${locationId}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    })
      .then(response => {
        if (!response.ok) throw new Error("Delete failed")
        setLocations(prevLocations => prevLocations.filter(location => location.id !== locationId))
      })
  }

  if (loading) return <h2>Loading locations...</h2>;
  if (locations.length === 0) return <h2>No locations found</h2>

  return (
    <div className="container-fluid py-5 px-5">
      <div className="row">
        <div className="col-12 col-xl-10 mx-auto">
          <div className="card shadow-lg border-0">

            <div className="card-header bg-info-subtle text-info-emphasis text-center py-4">
              <h4 className="mb-0">
                Locations of {locations[0]?.company_name}
              </h4>
            </div>

            <div className="card-body bg-light">
              <div className="row g-3">

                {locations?.map(location => (
                  <div key={location.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow-sm border-0 h-100">

                      <img src="https://www.esmadrid.com/sites/default/files/styles/content_type_full/public/recursosturisticos/compras/mercado_de_chamberi.jpg?itok=OFLp6NRV"
                        className="card-img-top"
                        alt="Location"
                        style={{ height: "180px", objectFit: "cover" }} />

                      <div className="card-body">

                        <h5 className="fw-bold">{location.city}</h5>
                        <p className="mb-1"><strong>Address:</strong> {location.address}</p>

                        <div className="mt-3 d-flex justify-content-between align-items-center">
                          <button className="btn btn-outline-primary px-4 shadow"
                            onClick={() => navigate(`/companies/private/locations/storages/${location.id}`)}>
                            View Storages
                          </button>

                          <div className="d-flex justify-content-end gap-1 mt-2">
                            <button className="btn btn-outline-secondary shadow"
                              onClick={() => navigate(`/companies/private/locations/${location.id}`)}>
                              <i className="fa-regular fa-eye"></i>
                            </button>

                            <button className="btn btn-outline-success shadow"
                              onClick={() => navigate(`/companies/private/locations/edit/${location.id}`)}>
                              <i className="fa-solid fa-pencil"></i>
                            </button>

                            <button className="btn btn-outline-danger shadow"
                              onClick={() => handleDelete(location.id)}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="card-footer bg-white border-0 py-3">
                  <div className="d-flex flex-column align-items-center gap-3">
                    <button className="btn btn-outline-success shadow" onClick={() => navigate("/companies/private/locations/create")}>
                      Create Location
                    </button>
                    <button className="btn btn-outline-secondary shadow" onClick={() => navigate("/companies/private")}>
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
  );
};