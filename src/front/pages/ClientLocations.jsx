import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const ClientLocations = () => {

    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadLocations = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const token = store.tokenClient
                const resp = await fetch(`${backendUrl}/api/location`,{
                    headers:{
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await resp.json(); 

                if (resp.ok) {
                    setLocations(data);
                }
            } catch (err) {
                console.error("Error loading locations", err);
            } finally {
                setLoading(false);
            }
        }
        loadLocations();

    }, [store.tokenClient]);

    if (loading) return <div>cargando ubicaciones...</div>
    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold display-5">Nuestras ubicaciones</h2>
                <p className="lead text-muted">Elige la ubicación que mejor te venga. ¡Trasteros de alta seguridad!</p>
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {locations.map((location, index) => (
                    <div key={location.id || index} className="col">
                        <div className="card h-100 shadow-lg border-0" style={{ borderRadius: "25px", overflow: "hidden", transition: "transform 0.3s" }}>
                            <div style={{ height: "350px", width: "100%" }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12143.7635645366!2d-3.882962!3d40.473663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd41903698000001%3A0x6b865664a7538c20!2sMajadahonda%2C%20Madrid!5e0!3m2!1ses!2ses!4v1700000000000"
                                    width="100%" height="100%" allowFullScreen="" loading="lazy">
                                </iframe>
                            </div>
                            <div className="card-body d-flex flex-column justify-content-between p-4" style={{ minHeight: "250px" }}>
                                <div>
                                    <h3 className="fw-bold">{location.city || 'Majadahonda'}</h3>
                                     <p className="text-muted">{location.description || `Instalaciones modernas en ${location.city || 'Madrid'}`}</p>
                                    <span className="badge mb-2 px-3 py-2 rounded-pill border border-secondary text-secondary" style={{ backgroundColor: "transparent" }}>
                                        {`Zona ${index + 1}` || 'Zona Noroeste' || location.zone}
                                    </span>
                                </div>
                                <button className="btn btn-primary w-100 fw-bold py-3 mt-3 shadow-sm" style={{ borderRadius: "12px" }} onClick={() => navigate(`/client/private/storages/${location.id}`)}>
                                    Seleccionar esta ubicación
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}