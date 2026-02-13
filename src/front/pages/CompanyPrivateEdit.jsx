import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const CompanyPrivateEdit = () => {

    const [companyId, setCompanyId] = useState("")
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
            const res = await fetch("https://api.cloudinary.com/v1_1/dofzpindm/image/upload", {
                method: "POST",
                body: formData
            })
            const data = await result.json()
            if (data.secure_url) setPhoto(data.secure_url)
            else console.error("Error en Cloudinary:", data)
        } catch (err) {
            console.error(err)
        } finally {
            setUploading(false)
        }
    }

    const handleUpdate = () => {
        fetch(import.meta.env.VITE_BACKEND_URL + `api/private/company/${companyId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({ photo, email, cif, address })
        })
            .then(res => {
                if (res.ok) navigate("/companies/private")
                else console.error("Error al guardar cambios:", res.statusText)
            })
            .catch(err => console.error(err))
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

                        <div className="card-body text-center">

                            <img
                                src={photo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbFBTwnuqabNGj5FCDXwiuGK_AtPM8IlQN-g&s"}
                                alt="Company"
                                className="rounded-circle mb-3 shadow-sm"
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />

                            <div className="mb-3">
                                <label className="form-label">Cambiar Foto</label>
                                <input type="file" className="form-control" onChange={handleUploadPhoto} />
                                {uploading && <p className="mt-2">Uploading image...</p>}
                            </div>

                            <div className="mb-3 text-start">
                                <label className="form-label"><strong>Email</strong></label>
                                <input type="email" className="form-control" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>

                            <div className="mb-3 text-start">
                                <label className="form-label"><strong>CIF</strong></label>
                                <input type="text" className="form-control" name="cif" value={cif} onChange={e => setCif(e.target.value)} />
                            </div>

                            <div className="mb-3 text-start">
                                <label className="form-label"><strong>Address</strong></label>
                                <input type="text" className="form-control" name="address" value={address} onChange={e => setAddress(e.target.value)} />
                            </div>

                            <div className="d-flex gap-2">
                                <button className="btn btn-success flex-fill" onClick={handleUpdate}>Guardar Cambios</button>
                                <button className="btn btn-secondary flex-fill" onClick={() => navigate("/companies/private")}>Cancelar</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}