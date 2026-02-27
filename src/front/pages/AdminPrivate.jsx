import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { verifyAdminToken, logoutAdmin } from "./utilsAdministrator";

export const AdminPrivate = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (!token) {
            navigate("/admin/login");
            return;
        }

        verifyAdminToken(token, dispatch).then(res => {
            if (!res.success) {
                navigate("/admin/login");
            } else {
                setLoading(false);
            }
        }).catch(err => {
            console.error(err);
            localStorage.removeItem("admin_token");
            navigate("/admin/login");
        });
    }, []);

    const handleLogout = () => {
        logoutAdmin(dispatch);
        navigate("/admin/login");
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const admin = store.admin_info || {};

    return (
        <div className="container-fluid">
            <div className="row">
                <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar vh-100 p-3 text-white">
                    <h4 className="text-center mb-4 text-primary">AdminPanel</h4>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2">
                            <a className="nav-link text-white active" href="#"><i className="bi bi-person-circle me-2"></i> Mi Perfil</a>
                        </li>
                        <li className="nav-item mb-2">
                            <a className="nav-link text-white-50" href="#"><i className="bi bi-speedometer2 me-2"></i> Dashboard</a>
                        </li>
                        <hr className="bg-secondary" />
                        <li className="nav-item mt-auto">
                            <button onClick={handleLogout} className="btn btn-outline-danger w-100">
                                Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </nav>      
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4 bg-light">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
                        <h1 className="h2 text-dark">Panel de Control</h1>
                        <span className="badge bg-success p-2">Estado: Administrador Activo</span>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 mb-4">
                            <div className="card shadow-sm border-0 text-center p-4">
                                <div className="mx-auto mb-3" style={{ width: "100px", height: "100px" }}>
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${admin.name || 'Admin'}&background=0D6EFD&color=fff&size=128`} 
                                        className="rounded-circle img-fluid shadow-sm"
                                        alt="Avatar"
                                    />
                                </div>
                                <h4 className="fw-bold mb-1">{admin.name || "Administrador"}</h4>
                                <p className="text-muted small mb-3">{admin.email}</p>
                                <button className="btn btn-sm btn-outline-primary px-4 rounded-pill">Editar Perfil</button>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="card shadow-sm border-0 p-4 mb-4">
                                <h5 className="mb-4 text-secondary">Información de la Cuenta</h5>
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <label className="text-muted small d-block">Identificador Único (ID)</label>
                                        <p className="fw-bold border-bottom pb-2">#{admin.id}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="text-muted small d-block">Correo Electrónico</label>
                                        <p className="fw-bold border-bottom pb-2">{admin.email}</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="text-muted small d-block">Rol del Sistema</label>
                                        <p className="fw-bold border-bottom pb-2 text-primary">Super Admin</p>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="text-muted small d-block">Nivel de Acceso</label>
                                        <p className="fw-bold border-bottom pb-2">Total</p>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion border-0 shadow-sm" id="accordionExample">
                                <div className="accordion-item border-0">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed bg-white text-primary fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseData">
                                            Ver Datos Técnicos (Secret)
                                        </button>
                                    </h2>
                                    <div id="collapseData" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div className="accordion-body bg-dark text-info rounded-bottom">
                                            <pre className="mb-0" style={{ fontSize: "0.85rem" }}>
                                                {JSON.stringify(admin, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};