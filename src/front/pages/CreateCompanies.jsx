import { useNavigate } from "react-router-dom"
import { createCompany } from "../utilsCompanies"
import { useState, useEffect } from "react"

export const CreateCompanies = () => {

    const navigate = useNavigate()
    const [formData, setFormData] = useState({})

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }


    const handleCreateCompany = async (e) => {
        e.preventDefault()
        try {
            await createCompany(formData)
            navigate("/companies")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-lg border-0">

                        <div className="card-header bg-info-subtle text-info-emphasis text-center py-4">
                            <h3 className="mb-0">
                                Create New Company
                            </h3>
                        </div>

                        <div className="card-body py-4">
                            <div className="row">
                                <form onSubmit={handleCreateCompany}>

                                    <div className="row">

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Company Name</label>
                                            <input type="text" className="form-control" placeholder="Enter company name" name="name" value={formData.name || ""} onChange={handleChange} required />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">CIF</label>
                                            <input type="text" className="form-control" placeholder="Enter CIF" name="cif" value={formData.cif || ""} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Address</label>
                                        <input type="text" className="form-control" placeholder="Enter address" name="address" value={formData.address || ""} onChange={handleChange} required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Email</label>
                                        <input type="email" className="form-control" placeholder="company@example.com" name="email" value={formData.email || ""} onChange={handleChange} required />
                                    </div>

                                    <div className="form-label fw-semibold">
                                        <label className="form-label d-block text-start">Password</label>
                                        <input type="password" className="form-control" placeholder="Enter password" name="password" value={formData.password || ""} onChange={handleChange} required />
                                    </div>

                                    <div className="card-footer bg-white border-0 py-2">
                                        <div className="d-flex flex-column align-items-center gap-3">
                                            <button type="submit" className="btn btn-outline-success shadow">
                                                Create
                                            </button>
                                            <button type="submit" className="btn btn-outline-secondary shadow" onClick={() => navigate("/companies")}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}