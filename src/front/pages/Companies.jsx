import { getCompany, getAllCompanies, deleteCompany, editCompany } from "../utilsCompanies"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUserRole } from "../store"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Companies = () => {
    const { store } = useGlobalReducer();
    const role = getUserRole(store);
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({ name: "", cif: "", address: "", email: "", password: "" });
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleGetCompanies = async () => {
        const data = await getAllCompanies();
        setCompanies(data);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        await editCompany(editingId, formData);
        handleGetCompanies();
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        setFormData({ name: "", cif: "", address: "", email: "", password: "" }); // Reset
    };

    const handleDeleteCompany = async (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta compañía?')) {
            await deleteCompany(id);
            handleGetCompanies();
        }
    };

    const handleEditCompany = async (id) => {
        const company = await getCompany(id);
        setFormData({ ...company, password: '' });
        setEditingId(id);
        new bootstrap.Modal(document.getElementById('editModal')).show();
    };

    useEffect(() => { handleGetCompanies() }, []);

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    
                    {/* Header Section */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold text-dark m-0">Directorio de Empresas</h2>
                        {role === "admin" && (
                            <button className="btn btn-primary shadow-sm px-4" onClick={() => navigate("/CreateCompanies")}>
                                + Nueva Empresa
                            </button>
                        )}
                    </div>

                    {/* Companies List Card */}
                    <div className="card border-0 shadow-sm overflow-hidden">
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                {companies.length > 0 ? (
                                    companies.map((company) => (
                                        <li key={company.id} className="list-group-item d-flex justify-content-between align-items-center p-4 hover-bg-light">
                                            <div>
                                                <h6 className="mb-0 fw-bold">{company.name}</h6>
                                                <small className="text-muted">{company.email}</small>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-light btn-sm border px-3" onClick={() => navigate(`/companies/${company.id}`)}>Ver más</button>
                                                {role === "admin" && (
                                                    <>
                                                        <button className="btn btn-outline-primary btn-sm px-3" onClick={() => handleEditCompany(company.id)}>Editar</button>
                                                        <button className="btn btn-outline-danger btn-sm px-3" onClick={() => handleDeleteCompany(company.id)}>Borrar</button>
                                                    </>
                                                )}
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item text-center py-5 text-muted">No hay compañías registradas.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Edición */}
            <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="fw-bold">Editar Perfil de Empresa</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="modal-body py-4">
                                <div className="mb-3">
                                    <label className="small fw-bold text-uppercase text-muted mb-1">Nombre</label>
                                    <input type="text" className="form-control bg-light border-0" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="small fw-bold text-uppercase text-muted mb-1">CIF</label>
                                        <input type="text" className="form-control bg-light border-0" name="cif" value={formData.cif} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="small fw-bold text-uppercase text-muted mb-1">Email</label>
                                        <input type="email" className="form-control bg-light border-0" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="small fw-bold text-uppercase text-muted mb-1">Dirección</label>
                                    <input type="text" className="form-control bg-light border-0" name="address" value={formData.address} onChange={handleChange} required />
                                </div>
                                <div className="mb-0">
                                    <label className="small fw-bold text-uppercase text-muted mb-1">Contraseña</label>
                                    <input type="password" className="form-control bg-light border-0" name="password" value={formData.password} onChange={handleChange} placeholder="Dejar vacío si no cambia" />
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button type="button" className="btn btn-link text-muted text-decoration-none" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" className="btn btn-primary px-4">Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};