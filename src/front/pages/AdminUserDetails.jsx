import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getAdminUser } from "./utilsAdministrators"

export const AdminUserDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [admin, setAdmin] = useState({})
    
    useEffect(() => { 
        const loadAdmin = async () => {
            const data = await getAdminUser(id)
            setAdmin(data)            
            }
            loadAdmin()
        }, [id])        
      
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                            <h2 className="h4 mb-0">{admin.name}</h2>
                            <button className="btn btn-outline-ligth btn-sm" onClick={() => navigate("/admin-users")}>Back</button>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <strong>ID:</strong> <span className="text-muted">{admin.id}</span>
                                </div> 
                                <div className="col-md-6 text-center">
                                    <strong>Email:</strong> <span className="text-muted">{admin.email}</span>
                                </div>                        
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}