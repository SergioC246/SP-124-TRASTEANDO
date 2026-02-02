import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createAdminUsers } from "./utilsAdministrators"


export const AdminUserCreate = () => {
    
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleCreate = async () => {
        if (!name || !email || !password) return

        const newUser = await createAdminUsers(name, email, password)

        if (newUser) {
            navigate("/admin-users")
        }
    }

    return (
        <div className="container py-4">
            <div className="col-lg-6 col-md-8 col-sm-12 mx-auto">

                <h2 className="mb-4">Create Admin User</h2>

                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={handleCreate}>
                        Create
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate("/admin-users")}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}