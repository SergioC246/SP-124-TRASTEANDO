import { useEffect, useState } from "react"
import { deleteAdminUsers, getAdminUsers } from "./utilsAdministrators"
import { useNavigate } from "react-router-dom"
import { AdminUserEdit } from "./AdminUserEdit"

export const AdminUsers = () => {

    const [adminUsers, setAdminUsers] = useState([])
    const [editAdmin, setEditAdmin] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        showAdmins()
    }, [])

    const showAdmins = async () => {
        const data = await getAdminUsers()
        setAdminUsers(data)
    }

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this admin?")
        if (!confirmed) return

        const success = await deleteAdminUsers(id)
        if (success) {
            setAdminUsers(adminUsers.filter(u => u.id !== id))
        }
    }

    return (
        <div className="container py-4">
            <div className="col-lg-8 col-md-10 col-sm-12">

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
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="mb-0">Admins</h2>
                            <button className="btn btn-success" onClick={() => navigate("/admin-create")} >
                                Create AdminUser
                            </button>
                        </div>

                        {adminUsers.map((admin) => (
                            <div key={admin.id} className="card mb-2">
                                <div className="card-body d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                                    <div>
                                        <h5 className="card-title">{admin.name}</h5>
                                        <p className="mb-0">{admin.email}</p>
                                        <p className="mb-0">ID: {admin.id}</p>
                                    </div>
                                    <div className="d-flex flex-column flex-sm-row gap-1 mt-3 mt-sm-0">
                                        <button className="btn btn-primary" onClick={() => setEditAdmin(admin)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(admin.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}