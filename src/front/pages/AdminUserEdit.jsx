import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { updateAdminUsers } from "./utilsAdministrator"

export const AdminUserEdit = ({ admin, onUpdate, onBack }) => {

    const [name, setName] = useState(admin.name)
    const [email, setEmail] = useState(admin.email)
    const [password, setPassword] = useState(admin.password || "")

    const navigate = useNavigate()

    const handleEdit = async () => {
        if (!name || !email || !password) return

        const updatedUser = await updateAdminUsers(admin.id, name, email, password)

        if (updatedUser) {
            onUpdate(updatedUser)
            navigate("/admin-users")
        }
    }

    return (
        <div className="container py-4">
            <div className="col-lg-6 col-md-8 col-sm-12 mx-auto">

                <h2 className="mb-4">Edit Admin User</h2>

                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="mb-4">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={handleEdit}>
                        Save
                    </button>
                    <button className="btn btn-secondary" onClick={onBack}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}