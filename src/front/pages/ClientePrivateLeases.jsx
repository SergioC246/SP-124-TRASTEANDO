import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { deleteClientLease } from "../utilsLeases";
import { useNavigate } from "react-router-dom";


export const ClientPrivateLeases = () => {
    const { store } = useGlobalReducer();
    const [myLeases, setMyLeases] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    const fetchLeases = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const resp = await fetch(`${backendUrl}/api/client/my-leases`, {
                headers: {
                    "Authorization": `Bearer ${store.tokenClient}`,
                    "Content-Type": "application/json"
                }
            });

            if (resp.ok) {
                const data = await resp.json();
                setMyLeases(data);
            }
        } catch (error) {
            console.error("Error al obtener mis contratos:", error);
        } finally {
            setLoading(false);
        }
    };

    // const handleDelete = async (id) => {
    //     if (!window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
    //         return;
    //     }

    //     try {
    //         await deleteClientLease(id, store.tokenClient);
    //         alert("Reserva eliminada con éxito");
    //         setMyLeases(myLeases.filter(lease => lease.id !== id));

    //     } catch (error) {
    //         console.error("Error al borrar:", error);
    //         alert("Error: " + error.message);
    //     }

    // }

    const handleCancelLease = async (leaseId) => {
        if (!window.confirm("¿Deseas cancelar esta reserva?")) return;

        try {
            await deleteClientLease(leaseId, store.tokenClient);
            alert("Reserva cancelada con éxito");
            fetchLeases(); // recargar lista de leases
        } catch (error) {
            console.error(error);
            alert("Error al cancelar la reserva");
        }
    };


    useEffect(() => {


        if (store.tokenClient) fetchLeases();
    }, [store.tokenClient]);

    if (loading) return <div className="text-center py-5">Cargando tus alquileres...</div>;

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4 text-center">Mis Trasteros Alquilados</h2>
            <div className="row g-4">
                {myLeases.length > 0 ? (
                    myLeases.map((lease) => (
                        <div key={lease.id} className="col-md-6 col-lg-4">
                            <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "20px", overflow: "hidden" }}>
                                <div className="card-header bg-primary text-white py-3">
                                    <h5 className="mb-0">Contrato #{lease.id}</h5>
                                </div>
                                <div className="card-body p-4">
                                    <div className="mb-3">
                                        <small className="text-muted d-block text-uppercase fw-bold">ID del Trastero</small>
                                        <span className="h5">Unidad {lease.storage_id}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <small className="text-muted d-block">Inicio</small>
                                            <span className="fw-bold text-success">{lease.start_date}</span>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Fin</small>
                                            <span className="fw-bold text-danger">{lease.end_date}</span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="d-flex align-items-center">
                                        <div className={`rounded-circle me-2 ${lease.status ? 'bg-success' : 'bg-secondary'}`} style={{ width: "12px", height: "12px" }}></div>
                                        <span className="small fw-bold">{lease.status ? 'Contrato Activo' : 'Finalizado'}</span>
                                    </div>
                                    <div className="d-flex justify-content-start mt-3">
                                        <button type="button" className="btn btn-outline-secondary btn-lg w-100 py-3 fw-bold rounded-pill border-2" onClick={() => handleCancelLease(lease.id)}>
                                            Cancelar reserva
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted h4">Aún no has alquilado ningún trastero.</p>
                    </div>
                )}
            </div>
        </div>
    );
};