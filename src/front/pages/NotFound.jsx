import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center"
         style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <h1 className="fw-bold mb-3" style={{ fontSize: 56, color: "#5C73F2" }}>404</h1>
      <h4 className="mb-2">Página no encontrada</h4>
      <p className="text-muted mb-4">
        Parece que esta página no existe o el enlace está roto.
      </p>
      <button
        className="btn px-4"
        style={{ background: "#5C73F2", color: "#fff", borderRadius: 10 }}
        onClick={() => navigate("/")}
      >
        Volver al inicio
      </button>
    </div>
  );
};