import { getCompany } from "../utilsCompanies"
import { getAllCompanies } from "../utilsCompanies"
import { deleteCompany } from "../utilsCompanies"
import { createCompany } from "../utilsCompanies"
import { editCompany } from "../utilsCompanies"
import { useState, useEffect } from "react"

export const Companies = () => {

    const [companies, setCompanies] = useState([])
    const [formData, setFormData] = useState({})
    const [isEditing, setIsEditing] = useState(false)


    const handleDeleteCompany = async (id) => {
        if (confirm('Delete?')) {
            await deleteCompany(id)
            handleGetCompanies()
        }
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        try {
            await editCompany(isEditing, formData)
            setFormData({})
            setIsEditing(false)
            handleGetCompanies()
        } catch (error) {
            console.error(error)
        }
    }


    const handleEditCompany = async (id) => {
        const company = await getCompany(id)
        setFormData(company)
        setIsEditing(id)
        const editModal = new bootstrap.Modal(document.getElementById('editModal'))
        editModal.show()
    }

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const handleCreateCompany = async (e) => {
        e.preventDefault()
        try {
            await createCompany(formData)
            setFormData({})
            handleGetCompanies()
        } catch (error) {
            console.error(error)
        }
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
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" >  See all Companies  </button>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Companies</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <ul className="list-group list-group-flush">
                                    {companies.map((company) => (
                                        <li className="list-group-item d-flex justify-content-between align-items-center" key={company.id} >{company.name}
                                            <div>
                                                <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEditCompany(company.id)}>Edit</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCompany(company.id)}>Delete</button>
                                            </div>
                                        </li>

                                    ))}
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* crear una compañia */}

                <button type="button" className="btn btn-success ms-3" data-bs-toggle="modal" data-bs-target="#createModal">Create a company</button>
                {/* <button type="button" className="btn btn-warning ms-2" data-bs-toggle="modal" data-bs-target="#editModal" disabled={!isEditing}>Edit</button> */}

                <div className="modal fade" id="createModal" tabIndex="-1" >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">New Company</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <form onSubmit={handleCreateCompany}>

                                <div className="modal-body ">
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">Company Name</label><input type="text" className="form-control" placeholder="Enter company name" name="name" value={formData.name || ""} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">CIF</label><input type="text" className="form-control" placeholder="Enter CIF" name="cif" value={formData.cif || ""} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">Address</label><input type="text" className="form-control" placeholder="Enter address" name="address" value={formData.address || ""} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">Email</label><input type="email" className="form-control" placeholder="company@example.com" name="email" value={formData.email || ""} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">Password</label><input type="password" className="form-control" placeholder="Enter password" name="password" value={formData.password || ""} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" className="btn btn-primary">Create</button>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>

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
                                        <label className="form-label d-block text-start">Company Name</label><input type="text" className="form-control" placeholder="Enter company name" name="name" value={formData.name || ""} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">CIF</label><input type="text" className="form-control" placeholder="Enter CIF" name="cif" value={formData.cif || ""} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">Address</label><input type="text" className="form-control" placeholder="Enter address" name="address" value={formData.address || ""} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">Email</label><input type="email" className="form-control" placeholder="company@example.com" name="email" value={formData.email || ""} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label d-block text-start">Password</label><input type="password" className="form-control" placeholder="Enter password" name="password" value={formData.password || ""} onChange={handleChange} required />
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