import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


export const CompanyStoragesEdit = () => {

    const { storage_id } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        size: "",
        price: "",
        location_id: "",
        status: true
    })

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token_company")
        if (!token) return

        fetch(`${import.meta.env.VITE_BACKEND_URL}api/private/company/storages/${storage_id}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })

            .then(response => response.json())
            .then(data => {
                setFormData(data)
                setLoading(false)
            })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        const token = localStorage.getItem("token_company")

        fetch(`${import.meta.env.VITE_BACKEND_URL}api/private/company/storages/${storage_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(() => navigate("/companies/private/storages"))
    }

    if (loading) return <h2>Loading storage...</h2>

    return (
        <div className="containet py-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Edit Storages</h4>
                        </div>

                        <div className="card-body">
                            <form />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}