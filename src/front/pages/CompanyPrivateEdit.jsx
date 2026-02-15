import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const CompanyPrivateEdit = () => {

    const [companyId, setCompanyId] = useState("")
    const [name, setName] = useState("")
    const [photo, setPhoto] = useState("")
    const [email, setEmail] = useState("")
    const [cif, setCif] = useState("")
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    const navigate = useNavigate()
    const token = localStorage.getItem("token_company")

    useEffect(() => {
        if (!token) {
            navigate("/companies/login")
            return
        }

        fetch(import.meta.env.VITE_BACKEND_URL + "api/private/company", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => {
                setCompanyId(data.id)
                setName(data.name || "")
                setPhoto(data.photo || "")
                setEmail(data.email || "")
                setCif(data.cif || "")
                setAddress(data.address || "")
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "topydai")
        setUploading(true)

        try {
            const result = await fetch("https://api.cloudinary.com/v1_1/dofzpindm/image/upload",
                {
                    method: "POST",
                    body: formData
                }
            )

            const data = await result.json()

            if (data.secure_url) {
                setPhoto(data.secure_url)
            } else {
                console.error("Error en Cloudinary:", data)
            }

        } catch (error) {
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    const handleUpdate = () => {
        const token = localStorage.getItem("token_company")

        fetch(import.meta.env.VITE_BACKEND_URL + `api/private/company/${companyId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({ name, photo, email, cif, address })
        })
            .then(response => response.json())
            .then(() => {
                navigate("/companies/private")
            })
            .catch(err => {
                console.error(err)
                alert("Error updating company")
            })
    }

    if (loading) return <h2 className="text-center mt-5">Cargando...</h2>

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-lg border-0">

                        <div className="card-header bg-info-subtle text-info-emphasis text-center py-4">
                            <h2 className="mb-0">Editar Company</h2>
                        </div>

                        <div className="card-body py-4">

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Company Name</label>
                                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Email</label>
                                    <input type="email" className="form-control" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">CIF</label>
                                    <input type="text" className="form-control" name="cif" value={cif} onChange={e => setCif(e.target.value)} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Address</label>
                                    <input type="text" className="form-control" name="address" value={address} onChange={e => setAddress(e.target.value)} />
                                </div>
                            </div>



                            <div>
                                <label className="form-label fw-semibold">Photo</label>
                                <input type="file" className="form-control" onChange={handleUploadPhoto} />
                            </div>

                            {uploading && <p className="mt-2">Uploading image...</p>}

                            {photo && (
                                <div className="mt-3 text-center">
                                    <img src={photo} alt="Company" className="img-fluid rounded shadow"
                                    />
                                </div>
                            )}

                            <div className="card-footer bg-white border-0 py-3 d-flex justify-content-center gap-3">
                                <button className="btn btn-outline-success shadow px-4" onClick={handleUpdate}>
                                    Save
                                </button>
                                <button className="btn btn-outline-secondary shadow px-4" onClick={() => navigate("/companies/private")}>
                                    Cancel
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}