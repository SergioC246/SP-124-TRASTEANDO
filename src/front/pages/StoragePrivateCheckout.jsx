import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getStorageOverview } from "../utilsStorages";
import { createLease } from "../utilsLeases";
import { createClientLease } from "../utilsLeases";


export const StoragePrivateCheckout = () => {
    const { storageId } = useParams();
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [storage, setStorage] = useState(null);
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(true);

    const handleCompleteOrder = async () => {
        if (!startDate) return alert("Por favor, elige una fecha de inicio.");
        if (!endDate) return alert("Por favor, elige una fecha de fin de contrato.");

        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
            return alert("La fecha de inicio debe ser valida.");
        }
        if (end <= start) {
            return alert("La fecha de fincalizacion debe ser posterior a la de inicio.")
        }

        try {
            const leaseData = {
                storage_id: parseInt(storageId),
                start_date: startDate,
                end_date: endDate,
                // status: true
            };

            await createClientLease(leaseData, store.tokenClient);
            alert("¡Reserva confirmada con éxito!");
            navigate("/client/private/leases");
        } catch (error) {
            console.error("Error detallado:", error);
            alert("Las fechas que has seleccionado no estan disponibles");
        }
    }

    // codigo añadido para lo de las fechas
    const isDateConflict = () => {
        if (!startDate || !endDate || !storage?.occupied_dates) return false;

        const start = new Date(startDate);
        const end = new Date(endDate);

        return storage.occupied_dates.some(lease => {
            const leaseStart = new Date(lease.start);
            const leaseEnd = new Date(lease.end);
            return start <= leaseEnd && end >= leaseStart;
        });
    };

    useEffect(() => {
        const loadInfo = async () => {
            try {
                const data = await getStorageOverview(storageId, store.tokenClient);
                setStorage(data);
            } catch (error) {
                console.error("Error al cargar datos", error);
            } finally {
                setLoading(false);
            }
        };
        if (storageId && store.tokenClient) loadInfo();
    }, [storageId, store.tokenClient]);


    return (

        <div className="container py-5">
            <div className="row g-5">

                <div className="col-md-7">
                    <h2 className="fw-bold mb-4">Finalizar reserva</h2>

                    <div className="card  border-0 p-4 mb-4">
                        <h5 className="fw-bold mb-3">Información del contrato</h5>
                        <label className="text-muted small fw-bold mb-2 text-uppercase">Fecha de entrada</label>
                        <input type="date" className="form-control form-control-lg border-2" style={{ borderRadius: "12px" }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="card  border-0 p-4 mb-4">
                        <label className="text-muted small fw-bold mb-2 text-uppercase">Fecha de salida</label>
                        <input type="date" className="form-control form-control-lg border-2" style={{ borderRadius: "12px" }} value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 p-4 bg-light sticky-top" style={{ borderRadius: "25px", top: "20px" }}>
                        <h4 className="fw-bold mb-4 text-center">Resumen de la orden</h4>
                        <div className="d-flex justify-content-between mb-3">
                            <span>Trastero #{storageId}</span>
                            <span className="fw-bold">{storage?.price}€</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span>Empresa</span>
                            <span className="text-muted small">{storage?.company_name}</span>
                        </div>

                        <hr />
                        <div className="d-flex justify-content-between mb-4">
                            <span className="h5 fw-bold">Total hoy</span>
                            <span className="h5 fw-bold text-primary">{storage?.price}€</span>
                        {/* // codigo añadido para lo de las fechas */}
                        </div>
                        {isDateConflict() && (
                            <div className="alert alert-danger mt-3">
                                ⚠️ Las fechas seleccionadas coinciden con una reserva existente.
                            </div>
                        )}
                        <button className="btn btn-primary btn-lg w-100 py-3 fw-bold rounded-pill shadow" onClick={handleCompleteOrder}>Confirmar Reserva</button>
                    </div>
                </div>
            </div>
        </div>


    )

}