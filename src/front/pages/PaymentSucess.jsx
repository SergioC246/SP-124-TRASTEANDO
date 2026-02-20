import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate("/client/private/leases");
        }, 3000);
    }, []);

    return (
        <div className="container text-center py-5">
            <h2 className="text-success">✅ Pago realizado con éxito</h2>
            <p>Tu suscripción se ha activado correctamente.</p>
            <p>Redirigiendo a tus contratos...</p>
        </div>
    );
};