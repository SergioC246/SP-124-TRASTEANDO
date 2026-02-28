import React from "react";

export const DeleteProfile = () => {
  return (
    <div className="card border border-danger shadow-sm rounded-4 p-4" style={{ background: "#fff" }}>
      <h5 className="fw-bold text-danger mb-3">Eliminar Cuenta</h5>
      <p className="text-muted">
        Una vez que elimines tu cuenta, no habrá vuelta atrás. Por favor, asegúrate de que no tienes alquileres activos.
      </p>
      <div className="form-check mb-4">
        <input className="form-check-input" type="checkbox" id="confirmDelete" />
        <label className="form-check-label small" htmlFor="confirmDelete">
          Entiendo las consecuencias y deseo proceder.
        </label>
      </div>
      <button className="btn btn-danger px-4" style={{ borderRadius: 10 }}>
        Eliminar mi cuenta permanentemente
      </button>
    </div>
  );
};