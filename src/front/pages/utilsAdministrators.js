const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Fetch para conseguir todos
export const getAdminUsers = async() =>{
    const response = await fetch(BACKEND_URL + "api/admin_user")

    const data = await response.json()

    return data
}


// Fetch para conseguir uno
export const getAdminUser = async(id) =>{
    const response = await fetch(BACKEND_URL + "api/admin_user/" + id)

    const data = await response.json()
    
    return data
}


//Fetch para crear
export const createAdminUsers = async (name, email, password) => {
    const response = await fetch(`${BACKEND_URL}api/admin_user`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ name, email, password })
    })

    if (response.status !== 201) {
        return null
    }

    return await response.json()
}


//Fetch para editar
export const updateAdminUsers = async (id, name, email, password) => {
    const response = await fetch(`${BACKEND_URL}api/admin_user/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ name, email, password })
    })

    if (response.status !== 200) {
        return null;
    }

    return await response.json()
}




// Fetch para eliminar
export const deleteAdminUsers = async(adminUserId) => {
    const response = await fetch(`${BACKEND_URL}api/admin_user/${adminUserId}`,{
        method: "DELETE"
    })
    return response.status === 200
}

