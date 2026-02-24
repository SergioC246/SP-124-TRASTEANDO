import { useEffect, useState } from "react"
import { deleteAdminUsers, getAdminUsers } from "./utilsAdministrator"
import { useNavigate } from "react-router-dom"
import { AdminUserEdit } from "./AdminUserEdit"

export const AdminUsers = () => {
    const [adminUsers, setAdminUsers] = useState([])
    const [editAdmin, setEditAdmin] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        showAdmins()
    }, [])

    const showAdmins = async () => {
        setLoading(true)
        const data = await getAdminUsers()
        setAdminUsers(data)
        setLoading(false)
    }

    const handleDelete = async (id) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este administrador?")
        if (!confirmed) return

        const success = await deleteAdminUsers(id)
        if (success) {
            setAdminUsers(adminUsers.filter(u => u.id !== id))
        }
    }

    if (loading && !editAdmin) return (
        <div className="container py-5 text-center text-muted">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Cargando administradores...
        </div>
    )

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-9">
                    
                    {editAdmin ? (
                        <AdminUserEdit
                            admin={editAdmin}
                            onUpdate={(updatedUser) => {
                                const newList = adminUsers.map(u =>
                                    u.id === updatedUser.id ? updatedUser : u
                                )
                                setAdminUsers(newList)
                                setEditAdmin(null)
                            }}
                            onBack={() => setEditAdmin(null)}
                        />
                    ) : (
                        <>
                            {/* --- HEADER --- */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="fw-bold text-dark m-0">Administradores</h2>
                                    <p className="text-muted small m-0">Gestión de usuarios con acceso al panel</p>
                                </div>
                                <button className="btn btn-primary shadow-sm px-4 fw-bold" onClick={() => navigate("/admin-create")}>
                                    + Nuevo Admin
                                </button>
                            </div>

                            {/* --- LISTADO --- */}
                            <div className="card border-0 shadow-sm overflow-hidden">
                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush">
                                        {adminUsers.length === 0 ? (
                                            <li className="list-group-item text-center py-5 text-muted">
                                                No hay administradores registrados.
                                            </li>
                                        ) : (
                                            adminUsers.map((admin) => (
                                                <li key={admin.id} className="list-group-item p-4 d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '1.1rem' }}>
                                                            {admin.name}
                                                        </h6>
                                                        <div className="text-muted small">
                                                            <div className="mb-1">
                                                                <span className="fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Email:</span> {admin.email}
                                                            </div>
                                                            <div>
                                                                <span className="fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>ID:</span> {admin.id}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex gap-2">
                                                        <button 
                                                            className="btn btn-light btn-sm border px-3" 
                                                            onClick={() => navigate(`/admin-details/${admin.id}`)}
                                                        >
                                                            Detalles
                                                        </button>
                                                        <button 
                                                            className="btn btn-outline-primary btn-sm px-3" 
                                                            onClick={() => setEditAdmin(admin)}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button 
                                                            className="btn btn-outline-danger btn-sm px-3" 
                                                            onClick={() => handleDelete(admin.id)}
                                                        >
                                                            Borrar
                                                        </button>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}