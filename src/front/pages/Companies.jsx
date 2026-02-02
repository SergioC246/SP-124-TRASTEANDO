import { getCompany } from "../utilsCompanies"
import { getAllCompanies } from "../utilsCompanies"
import { deleteCompany } from "../utilsCompanies"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { editCompany } from "../utilsCompanies"

export const Companies = () => {

    const navigate = useNavigate()
    const [companies, setCompanies] = useState([])

    const handleChange = (e) => {
        const editingData = JSON.parse(localStorage.getItem('editingCompany') || '{}')
        const newData = { ...editingData, [e.target.name]: e.target.value }
        localStorage.setItem('editingCompany', JSON.stringify(newData))
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        try {
            const editingId = localStorage.getItem('editingId')
            const editingData = JSON.parse(localStorage.getItem('editingCompany'))
            await editCompany(editingId, editingData)
            localStorage.removeItem('editingCompany')
            localStorage.removeItem('editingId')
            handleGetCompanies()
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'))
            editModal.hide()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteCompany = async (id) => {
        if (confirm('Delete?')) {
            await deleteCompany(id)
            handleGetCompanies()
        }
    }

    const handleEditCompany = async (id) => {
        const company = await getCompany(id)
        const tempFormData = { ...company, password: '' }
        localStorage.setItem('editingCompany', JSON.stringify(tempFormData))
        localStorage.setItem('editingId', id)
        const editModal = new bootstrap.Modal(document.getElementById('editModal'))
        editModal.show()
    }


    const handleGetCompanies = async () => {
        const data = await getAllCompanies()
        setCompanies(data)
    }

    useEffect(() => {
        handleGetCompanies()
    }, [])



    return (
        <>

            {/* see all companies */}
            <div className="text-center" >

                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="card shadow-sm">
                                <div className="card-header bg-white py-3">
                                    <h2 className="h4 mb-0 text-secondary">Companies</h2>
                                </div>

                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush">
                                        {companies.map((company) => (
                                            <li
                                                className="list-group-item d-flex justify-content-between align-items-center py-3 px-4"
                                                key={company.id}
                                            >
                                                <span className="fw-medium text-dark">{company.name}</span>
                                                <div className="btn-group">
                                                    <button className="btn btn-sm btn-outline-warning rounded-pill me-2 px-3" onClick={() => navigate(`/companies/${company.id}`)} >Details</button>
                                                    <button className="btn btn-sm btn-outline-warning rounded-pill me-2 px-3" onClick={() => handleEditCompany(company.id)}>Edit</button>
                                                    <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleDeleteCompany(company.id)}> Delete </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {companies.length === 0 && (
                                    <div className="card-body text-center text-muted">
                                        No hay compañías registradas.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* crear una compañia */}

                <button type="button" className="btn btn-success ms-3 mt-4" onClick={() => navigate("/CreateCompanies")} >Create a company</button>

                {/* edit company */}

                <div className="modal fade" id="editModal" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Edit Company</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <form onSubmit={handleEditSubmit}>
                                <div className="modal-body ">
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">Company Name</label><input type="text" className="form-control" placeholder="Enter company name" name="name" defaultValue={JSON.parse(localStorage.getItem('editingCompany') || '{}').name || ""} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">CIF</label><input type="text" className="form-control" placeholder="Enter CIF" name="cif" defaultValue={JSON.parse(localStorage.getItem('editingCompany') || '{}').cif || ""}  onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">Address</label><input type="text" className="form-control" placeholder="Enter address" name="address" defaultValue={JSON.parse(localStorage.getItem('editingCompany') || '{}').address || ""} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">Email</label><input type="email" className="form-control" placeholder="company@example.com" name="email" defaultValue={JSON.parse(localStorage.getItem('editingCompany') || '{}').email || ""}  onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">Password</label><input type="password" className="form-control" placeholder="Enter password" name="password" defaultValue={JSON.parse(localStorage.getItem('editingCompany') || '{}').password || ""}  onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" className="btn btn-primary">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>


            </div>


        </>

    )
}