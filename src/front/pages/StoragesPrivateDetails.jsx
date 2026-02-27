import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect, useState } from "react";
import { getStorageOverview } from "../utilsStorages";

export const StoragesPrivateDetails = () => {
    const { storageId } = useParams();
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [storage, setStorage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAvailable, setIsAvailable] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await getStorageOverview(storageId);
                setStorage(data);
                setIsAvailable(data.status === "available" && !data.occupied);
            } catch (error) {
                console.error("Error al cargar los detalles del trastero.", error);
            } finally {
                setLoading(false);
            }
        };
        if (storageId) fetchDetail();
    }, [storageId]);

    if (loading) return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <div className="spinner-border" style={{ color: "#5c73f2" }} role="status"></div>
            <p className="mt-3 fw-bold text-muted">Cargando el espacio ideal...</p>
        </div>
    );

    if (!storage) return (
        <div className="container py-5 text-center min-vh-100 d-flex align-items-center justify-content-center">
            <h3>No se encontró el trastero.</h3>
        </div>
    );

    // Imagen por defecto si no viene de la API
    const mainImage = storage.photo || "https://images.unsplash.com/photo-1581404917829-53144e2c115f?auto=format&fit=crop&q=80&w=1000";

    return (
        <div className="container py-4 pb-5" style={{ color: "#222222", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            
            {/* Navegación y Título */}
            <div className="mb-4">
                <button className="btn btn-link text-decoration-none p-0 mb-3 fw-bold" style={{ color: "#222222" }} onClick={() => navigate(-1)}>
                    <i className="bi bi-chevron-left me-1"></i> Volver a la búsqueda
                </button>
                <h1 className="fw-bold mb-2" style={{ fontSize: "2rem" }}>
                    Trastero privado en {storage.city}
                </h1>
                <div className="d-flex align-items-center text-muted fw-semibold">
                    <span className="me-2"><i className="bi bi-star-fill me-1" style={{ color: "#222222" }}></i>Nuevo</span>
                    <span className="mx-2 text-decoration-underline">{storage.city}, España</span> 
                </div>
            </div>
            <div className="row g-2 mb-5" style={{ height: "400px", borderRadius: "15px", overflow: "hidden" }}>
                <div className="col-md-6 h-100">
                    <img src={mainImage} alt="Main Storage" className="w-100 h-100 object-fit-cover" />
                </div>
                <div className="col-md-6 h-100 d-none d-md-block">
                    <div className="row g-2 h-100">
                        <div className="col-6 h-50"><img src="https://extrastorageinc.com/wp-content/uploads/2023/11/DALL%C2%B7E-2023-11-30-06.26.37-A-wide-angle-view-of-a-self-storage-unit-with-a-light-colored-interior-and-a-vibrant-red-rolling-door-designed-for-storing-seasonal-decorations-with.png" alt="Detail 1" className="w-100 h-100 object-fit-cover" /></div>
                        <div className="col-6 h-50"><img src="https://media.istockphoto.com/id/1803821352/photo/customer-opening-lock-of-unit.jpg?s=612x612&w=0&k=20&c=yY9vyEU0vMxh0RlKYNd4NK53OJ3jjYv6dgdWsBX5zZY=" alt="Detail 2" className="w-100 h-100 object-fit-cover" /></div>
                        <div className="col-6 h-50"><img src="https://images.squarespace-cdn.com/content/v1/68adcb2d961c9a6c2b3a2ee5/5abb9731-7c39-45ad-9f0a-454f8c40c3c3/shutterstock_2390631077.jpg" alt="Detail 3" className="w-100 h-100 object-fit-cover" /></div>
                        <div className="col-6 h-50"><img src="https://media.istockphoto.com/id/1803815278/photo/cart-with-cardboard-boxes.jpg?s=612x612&w=0&k=20&c=zuQB9UgTQ7LuTDpvhfitfyhVJeJJP9YNMoMZbVIeDZY=" alt="Detail 4" className="w-100 h-100 object-fit-cover" /></div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-between">
                <div className="col-lg-7 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom">
                        <div>
                            <h2 className="fw-bold fs-4 mb-1">Alojamiento de pertenencias administrado por {storage.company_name}</h2>
                            <p className="text-muted mb-0">{storage.size}m² de superficie • Espacio privado • ID: #{storage.id}</p>
                        </div>                        
                    </div>

                    <div className="mb-4 pb-4 border-bottom">
                        <div className="d-flex mb-4">
                            <i className="bi bi-door-open fs-3 me-4" style={{ color: "#222222" }}></i>
                            <div>
                                <h5 className="fw-bold mb-1 fs-6">Llegada autónoma</h5>
                                <p className="text-muted small mb-0">Accede al trastero fácilmente mediante código de seguridad.</p>
                            </div>
                        </div>
                        <div className="d-flex mb-4">
                            <i className="bi bi-shield-check fs-3 me-4" style={{ color: "#222222" }}></i>
                            <div>
                                <h5 className="fw-bold mb-1 fs-6">Seguridad garantizada</h5>
                                <p className="text-muted small mb-0">Vigilancia 24/7 para que tus pertenencias estén siempre a salvo.</p>
                            </div>
                        </div>
                        <div className="d-flex">
                            <i className="bi bi-geo-alt fs-3 me-4" style={{ color: "#222222" }}></i>
                            <div>
                                <h5 className="fw-bold mb-1 fs-6">Ubicación excelente</h5>
                                <p className="text-muted small mb-0">Zona céntrica y de fácil acceso con vehículos en {storage.city}.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 pb-4 border-bottom">
                        <h4 className="fw-bold mb-3 fs-5">Acerca de este espacio</h4>
                        <p className="text-muted" style={{ lineHeight: "1.6" }}>
                            Este trastero ofrece el espacio perfecto para liberar tu hogar u oficina. Administrado profesionalmente por <strong>{storage.company_name}</strong>, el espacio se entrega completamente limpio, asegurado y listo para usar. Ya sea que necesites guardar cajas, muebles o equipamiento deportivo, este espacio de <strong>{storage.size}</strong> se adapta a tus necesidades.
                        </p>
                    </div>
                </div>

                {/* Columna Derecha: Tarjeta de Reserva */}
                <div className="col-lg-4">
                    <div className="position-sticky" style={{ top: "20px" }}>
                        <div className="card border-0 shadow-lg p-4" style={{ borderRadius: "16px" }}>
                            
                            {/* Precio y estado */}
                            <div className="d-flex justify-content-between align-items-end mb-4">
                                <div>
                                    <span className="fs-3 fw-bold">{storage.price}€</span>
                                    <span className="text-muted ms-1">/ mes</span>
                                </div>
                                <div>
                                    {isAvailable ? (
                                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill"><i className="bi bi-check-circle-fill me-1"></i> Disponible</span>
                                    ) : (
                                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded-pill"><i className="bi bi-x-circle-fill me-1"></i> Ocupado</span>
                                    )}
                                </div>
                            </div>

                            {/* Falso selector para mantener la estética */}
                            <div className="border rounded-3 mb-3">
                                <div className="d-flex border-bottom">
                                    <div className="p-2 w-50 border-end">
                                        <small className="d-block fw-bold text-uppercase" style={{ fontSize: "0.65rem" }}>Inicio previsto</small>
                                        <small className="text-muted">Inmediato</small>
                                    </div>
                                    <div className="p-2 w-50">
                                        <small className="d-block fw-bold text-uppercase" style={{ fontSize: "0.65rem" }}>Duración</small>
                                        <small className="text-muted">Mensual</small>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <small className="d-block fw-bold text-uppercase" style={{ fontSize: "0.Espacio65rem" }}></small>
                                    <small className="text-muted">{storage.size}m² </small>
                                </div>
                            </div>

                            {/* Botón CTA */}
                            <button 
                                className={`btn w-100 py-3 fw-bold text-white fs-6 mb-3 ${!isAvailable ? 'disabled' : ''}`} 
                                style={{ background: isAvailable ? "#f24171" : "#cccccc", borderRadius: "10px", transition: "all 0.2s" }}
                                onClick={() => navigate(`/client/private/checkout/${storage.id}`)}
                            >
                                {isAvailable ? 'Reservar espacio' : 'No disponible'}
                            </button>

                            <div className="text-center text-muted small">
                                No se te cobrará nada todavía
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
    );
};