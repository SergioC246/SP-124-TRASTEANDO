import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getCompany } from "../utilsCompanies"

export const CompanyDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [company, setCompany] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await getCompany(id)
                setCompany(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchCompany()
    }, [id])

    if (loading) return <div className="container mt-5">Cargando...</div>

    if (!company) return <div className="container mt-5">Empresa no encontrada</div>

    return (

        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow-sm">
                            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                                <h2 className="h4 mb-0">{company.name}</h2>
                                <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/companies")}>Back to List </button>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <strong>CIF:</strong> <span className="text-muted">{company.cif}</span>
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Email:</strong> <span className="text-muted">{company.email}</span>
                                    </div>
                                    <div className="col-12">
                                        <strong>Address:</strong> <span className="text-muted">{company.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )

}