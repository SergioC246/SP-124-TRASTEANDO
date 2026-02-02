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
        <>
                <div className="container mt-5" >
                    <h1>New Company</h1>
                    <form onSubmit={handleCreateCompany}>
                        <div className="container mt-5">
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
                        <div className="d-flex gap-2 mt-3">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate("/companies")}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Create</button>
                        </div>
                    </form>
                </div>

        </>
    )
}