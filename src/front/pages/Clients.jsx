import { useEffect, useState } from "react";
import { getAllClients, createClient, editClient, deleteClient } from "../utilsClients.js";

export const Clients = () => {
    const [clients, setClients] = useState([]);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("list");

    const loadClients = () => {
        setLoading(true);
        getAllClients()
            .then(data => {
                setClients(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => { loadClients() }, []);

    const handleChange = (c) => {
        const { name, value, type, checked } = c.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSave = () => {
        const action = form.id
            ? editClient(form.id, { email: form.email, is_active: form.is_active })
            : createClient({ email: form.email, password: form.password, is_active: form.is_active });

        action
            .then(() => {
                setForm(null);
                setMode("list");
                loadClients();
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
        deleteClient(id).then(loadClients).catch(err => console.error(err));
    };

    if (loading) return (
        <div className="container py-5 text-center text-muted">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Cargando clientes...
        </div>
    );

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    
                    {/* --- HEADER --- */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold text-dark m-0">Gestión de Clientes</h2>
                        {mode === "list" && (
                            <button className="btn btn-primary shadow-sm px-4"
                                onClick={() => {
                                    setMode("create");
                                    setForm({ email: "", password: "", is_active: true });
                                }}
                            >
                                + Nuevo Cliente
                            </button>
                        )}
                    </div>

                    {/* --- LIST MODE --- */}
                    {mode === "list" && (
                        <div className="card border-0 shadow-sm overflow-hidden">
                            <div className="card-body p-0">
                                <ul className="list-group list-group-flush">
                                    {clients.length === 0 ? (
                                        <li className="list-group-item text-center py-5 text-muted">No se encontraron clientes.</li>
                                    ) : (
                                        clients.map(client => (
                                            <li key={client.id} className="list-group-item d-flex justify-content-between align-items-center p-4">
                                                <div>
                                                    <h6 className="mb-0 fw-bold">{client.email}</h6>
                                                    <span className={`badge rounded-pill ${client.is_active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                                        {client.is_active ? "Activo" : "Inactivo"}
                                                    </span>
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-light btn-sm border px-3" onClick={() => { setForm(client); setMode("details"); }}>Detalles</button>
                                                    <button className="btn btn-outline-primary btn-sm px-3" onClick={() => { setForm(client); setMode("edit"); }}>Editar</button>
                                                    <button className="btn btn-outline-danger btn-sm px-3" onClick={() => handleDelete(client.id)}>Borrar</button>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                   {/* --- CREATE / EDIT MODE --- */}
{(mode === "create" || mode === "edit") && (
    <div className="card border-0 shadow-sm p-4">
        <div className="card-body">
            <h3 className="fw-bold mb-4">{mode === "edit" ? "Editar Cliente" : "Crear Nuevo Cliente"}</h3>
            
            <div className="mb-3">
                <label className="small fw-bold text-uppercase text-muted mb-1">Email</label>
                <input type="email" className="form-control bg-light border-0" name="email" value={form.email} onChange={handleChange} placeholder="nombre@cliente.com" />
            </div>

            {/* Ahora mostramos Password también en EDIT */}
            <div className="mb-3">
                <label className="small fw-bold text-uppercase text-muted mb-1">
                    {mode === "edit" ? "Cambiar Contraseña" : "Contraseña"}
                </label>
                <input 
                    type="password" 
                    className="form-control bg-light border-0" 
                    name="password" 
                    value={form.password || ""} 
                    onChange={handleChange} 
                    placeholder={mode === "edit" ? "Nueva contraseña, dejar vacío si no cambia" : "••••••••"} 
                />                
            </div>

            <div className="form-check form-switch mb-4">
                <input className="form-check-input" type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} id="activeCheck" />
                <label className="form-check-label text-muted" htmlFor="activeCheck">Cliente activo</label>
            </div>

            <div className="d-grid gap-2">
                <button className="btn btn-primary fw-bold py-2" onClick={handleSave}>Guardar Cambios</button>
                <button className="btn btn-light text-muted py-2" onClick={() => { setForm(null); setMode("list"); }}>Cancelar</button>
            </div>
        </div>
    </div>
)}

                    {/* --- DETAILS MODE --- */}
                    {mode === "details" && form && (
                        <div className="card border-0 shadow-sm p-4 text-center">
                            <div className="card-body">
                                <div className="mb-4">
                                    <div className="bg-light d-inline-block rounded-circle p-4 mb-3">
                                        <i className="fas fa-user fa-3x text-primary"></i>
                                    </div>
                                    <h3 className="fw-bold m-0">{form.email}</h3>
                                    <p className="text-muted">ID de Usuario: #{form.id}</p>
                                </div>
                                <div className="list-group list-group-flush border-top border-bottom mb-4 text-start">
                                    <div className="list-group-item bg-transparent py-3 d-flex justify-content-between">
                                        <span className="text-muted small fw-bold text-uppercase">Estado actual</span>
                                        <span className={form.is_active ? "text-success fw-bold" : "text-danger fw-bold"}>
                                            {form.is_active ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>
                                </div>
                                <button className="btn btn-primary px-5" onClick={() => { setForm(null); setMode("list"); }}>
                                    Cerrar Detalles
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};