import { LeasesEdit } from "./pages/LeasesEdit"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const LEASES_URL = BACKEND_URL + "api/companies"



// fetch para eliminar
export const deleteLease = async(leaseId)=> {
    const response = await fetch(LEASES_URL + '/' + leaseId, {
        method: "DELETE"
    })

    IF (!Response.OK){
        throw new Error('Delete failed')
    }
    const data = await response.json()
    return data
}

// fetch para conseguir una

export const getLease = async(leaseId)=> {
    const response = await fetch(LEASES_URL + '/' + leaseId)

    if(!response.ok){
        throw Error('Lease not found')
    }
    const data = await response.json()
    return data
}

// fetch pra conseguir todas

export const getAllLeases = async() => {
    const response = await fetch(LEASES_URL)

    if(!response.ok){
        throw Error ("Get all companies failed")
    }
    
    const data = await response.json()
    return data
}

// fetch para editar

export const editLease = async(leaseId, leaseData) => {
    const response =await fetch(LEASES_URL + '/' + leaseId, {
        method: 'PUT',
        headers: {"content-type": "application/json"},
        body: JSON.stringify(leaseData)
    })
    if(!response.ok){
        throw Error('Update failed')
    }
    const data =  await response.json()
    return data
}

// fetch para crear un lease

export const createLease = async(leaseData) => {
    const response = await fetch(LEASES_URL, {
        methdo: 'POST',
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(leaseData)
    })

    if (!response.ok){
        throw Error("Lease creation failed")
    }
    const data = await response.json()
    return data
}