import{ useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { store } = useGlobalReducer();

    useEffect(() => {
        const confirmAndMove = async () => {
            const leaseId = searchParams.get("lease_id");
            console.log("ID recuperado de la URL:", leaseId); // Para debugear
            
            if (leaseId && store.tokenClient) {
                try {
                    // Esperamos a que el fetch termine ANTES de seguir
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/client/leases/${leaseId}/confirm`, {
                        method: "PATCH",
                        headers: { 
                            "Authorization": `Bearer ${store.tokenClient}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (response.ok) {
                        console.log("¡Contrato activado en DB!");
                    }
                } catch (e) {
                    console.error("Error confirmando:", e);
                }
            }

            // SOLO después de intentar confirmar, esperamos 3 segundos y navegamos
            setTimeout(() => {
                navigate("/client/private/leases");
            }, 3000);
        };

        confirmAndMove();
    }, [searchParams, store.tokenClient]); // Añadimos dependencias

    return (
        <div className="container text-center py-5">
            <h2 className="text-success">✅ Pago realizado con éxito</h2>
            <p>Estamos activando tu contrato, no cierres esta ventana...</p>
        </div>
    );
};

// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export const PaymentSuccess = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         setTimeout(() => {
//             navigate("/client/private/leases");
//         }, 3000);
//     }, []);

//     return (
//         <div className="container text-center py-5">
//             <h2 className="text-success">✅ Pago realizado con éxito</h2>
//             <p>Tu suscripción se ha activado correctamente.</p>
//             <p>Redirigiendo a tus contratos...</p>
//         </div>
//     );
// };