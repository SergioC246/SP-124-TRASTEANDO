import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const CompanyPrivate = () => {
    
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")

        if(!token) {
            navigate("/companies/login")
            return
        }

        fetch(import.meta.env.VITE_BACKEND_URL + "/api/private/company", {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
             }
        })
            .then(response => {
                if (response.status !== 200) {
                    navigate("/companies/login")
                }
                return response.json()
            })            
    },[])

    return (
        <div className="container py-4">
            <h2>Company Private Area</h2>
            <p>Hola, estas en el area privada de company</p>
        </div>
    )
}