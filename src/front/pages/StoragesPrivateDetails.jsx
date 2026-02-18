import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect, useState } from "react";
import { getStorageOverview } from "../utilsStorages";

export const StoragesPrivateDetails = () => {
    const { storageId } = useParams();
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [storage, setStorage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAvailable, setIsAvailable] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const token = store.tokenClient;
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/storage/${storageId}/overview`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok) throw new Error("Error storage");
                const data = await response.json();

                setStorage(data);
                
                setIsAvailable(data.status === true && !data.occupied);

            } catch (error) {
                console.error("Error al cargar los detalles del trastero.", error);
            } finally {
                setLoading(false);
            }
        };
        if (storageId && store.tokenClient) fetchDetail();
    }, [storageId, store.tokenClient]);

    if (loading) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Cargando información detallada...</p>
        </div>
    )

    if (!storage) return <div className="container py-5 text-center"><h3>No se encontró el trastero.</h3></div>;

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <button className="btn btn-outline-secondary mb-4 rounded-pill px-4 shadow-sm" onClick={() => navigate(-1)}> ← Volver a la lista </button>
                    <div className="card shadow-lg border-0" style={{ borderRadius: "25px", overflow: "hidden" }}>
                        <div className="row g-0">
                            <div className="col-md-5 bg-dark d-flex align-items-center justify-content-center text-white p-5 text-center">
                                <div>
                                    <div className="mb-3 text-primary display-4">
                                        <i className="bi bi-building-check"></i>
                                    </div>
                                    <h2 className="fw-bold">{storage.company_name}</h2>
                                    <p className="text-primary fw-bold mb-0">
                                        <i className="bi bi-geo-alt-fill me-1"></i>
                                        {storage.city}
                                    </p>
                                    <hr className="my-4" />
                                    <p className="small text-white">ID de Unidad: #{storage.id}</p>
                                </div>
                            </div>
                            <div className="col-md-7">
                                <div className="card-body p-5">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h2 className="fw-bold mb-0">Especificaciones</h2>
                                        <span className={`badge rounded-pill px-3 py-2 ${isAvailable ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                            {isAvailable ? 'Disponible' : 'Ocupado'}
                                        </span>

                                    </div>
                                    <div className="row g-3 mb-4">
                                        <div>
                                            {/* <div className="col-6 text-center border rounded-4 p-3 bg-light"> */}
                                            <small className="text-muted d-block mb-1">Superficie</small>
                                            <span className="fs-3 fw-bold">{storage.size}</span>
                                        </div>
                                        <div>
                                            {/* <div className="col-6 text-center border rounded-4 p-3 bg-light"> */}
                                            <small className="text-muted d-block mb-1">Precio mensual</small>
                                            <span className="fs-3 fw-bold text-primary">{storage.price}€</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-light rounded-4 mb-5  border-primary border-4">
                                        <h6 className="fw-bold mb-1 text-primary">Detalles de la ubicación:</h6>
                                        <p className="small text-muted mb-0">Este trastero en <strong>{storage.city}</strong> es gestionado por <strong>{storage.company_name}</strong>. Incluye seguridad privada y acceso optimizado.</p>
                                    </div>
                                    <button className={`btn btn-primary btn-lg w-100 py-3 fw-bold shadow ${!isAvailable ? 'disabled' : ''}`} style={{ borderRadius: "15px" }} onClick={() => navigate(`/client/private/checkout/${storage.id}`)}>
                                        {isAvailable ? 'Continuar con el Arrendamiento' : 'Trastero Ocupado'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}