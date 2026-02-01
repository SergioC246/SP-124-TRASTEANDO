import { useState } from "react"
import { createAdminUsers, deleteAdminUsers, getAdminUsers, updateAdminUsers } from "./utilsAdministrators"



export const AdminUsers = () => {

    const [adminUsers, setAdminUsers] = useState([])    
    const [nameToCreate, setNameToCreate] = useState("")
    const [emailToCreate, setEmailToCreate] = useState("")
    const [passwordToCreate, setPasswordToCreate] = useState("")
    const [idToEdit, setIdToEdit] = useState("")
    const [nameToEdit, setNameToEdit] = useState("")
    const [emailToEdit, setEmailToEdit] = useState("")
    const [passwordToEdit, setPasswordToEdit] = useState("")
    const [idToDelete, setIdToDelete] = useState("")


    const handleGetAdminUsers = async () => {
        const adminUsers = await getAdminUsers()
        setAdminUsers(adminUsers)
    }


    const handleCreateAdminUsers = async () => {
        if (nameToCreate && emailToCreate && passwordToCreate) {
            const newUser = await createAdminUsers(nameToCreate, emailToCreate, passwordToCreate)
            if (newUser) {
                setAdminUsers([...adminUsers, newUser])
                setNameToCreate("")
                setEmailToCreate("")
                setPasswordToCreate("")
            }
        }
    }


    const handleEditAdminUsers = async () => {
        const id = parseInt(idToEdit)
        if (idToEdit && nameToEdit && emailToEdit && passwordToEdit) {
            const updatedUser = await updateAdminUsers(idToEdit, nameToEdit, emailToEdit, passwordToEdit);
            
            if (updatedUser) {
                const newList = adminUsers.map(user =>
                    user.id === updatedUser.id ? updatedUser : user
                )
                setAdminUsers(newList);

                setIdToEdit("")
                setNameToEdit("")
                setEmailToEdit("")
                setPasswordToEdit("")
            }
        }
    }


    const handleDeleteAdminUsers = async () => {
        const isDeleted = await deleteAdminUsers(idToDelete)
        if (isDeleted) {
            setIdToDelete("")
        }
    }



    return (
        <div className="container-fluid d-flex justify-content-center py-4">
            <div className="col-lg-8 col-md-10 col-sm-12 shadow rounded">
                <div className="accordion" id="accordionExample">

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGet" aria-expanded="false" aria-controls="collapseGet"
                                onClick={handleGetAdminUsers}>
                                Get admin_users
                            </button>
                        </h2>
                        <div id="collapseGet" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <ul>
                                    {adminUsers.map((admin_user) => {
                                        return <li key={admin_user.id}><div className="card" style={{ width: "18rem" }}>
                                            <div className="card-body">
                                                <h5 className="card-title">{admin_user.name}</h5>
                                                <p className="card-text">{admin_user.email}</p>
                                            </div>
                                        </div>
                                        </li>
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCreate" aria-expanded="false" aria-controls="collapseCreate">
                                Create admin_users
                            </button>
                        </h2>
                        <div id="collapseCreate" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <label>Full Name</label>
                                <input type="text" value={nameToCreate} onChange={(e) => setNameToCreate(e.target.value)} className="form-control mb-2"></input>

                                <label>Email</label>
                                <input type="email" value={emailToCreate} onChange={(e) => setEmailToCreate(e.target.value)} className="form-control mb-2"></input>

                                <label>Password</label>
                                <input type="password" value={passwordToCreate} onChange={(e) => setPasswordToCreate(e.target.value)} className="form-control mb-2"></input>

                                <button className="btn btn-success" onClick={handleCreateAdminUsers}>Create admin_user</button>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEdit" aria-expanded="false" aria-controls="collapseEdit">
                                Edit admin_users
                            </button>
                        </h2>
                        <div id="collapseEdit" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <label>ID to Edit</label>
                                <input type="text" placeholder="Enter ID number" value={idToEdit} onChange={(e) => setIdToEdit(e.target.value)} className="form-control mb-2"></input>

                                <label>Full Name</label>
                                <input type="text" value={nameToEdit} onChange={(e) => setNameToEdit(e.target.value)} className="form-control mb-2"></input>
                                
                                <label>Email</label>
                                <input type="email" value={emailToEdit} onChange={(e) => setEmailToEdit(e.target.value)} className="form-control mb-2"></input>

                                <label>Password</label>
                                <input type="password" value={passwordToEdit} onChange={(e) => setPasswordToEdit(e.target.value)} className="form-control mb-2"></input>

                                <button className="btn btn-primary" onClick={handleEditAdminUsers}>Edit admin_user</button>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDelete" aria-expanded="false" aria-controls="collapseDelete">
                                Delete ID admin_users
                            </button>
                        </h2>
                        <div id="collapseDelete" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <button className="btn btn-danger mb-2" onClick={handleDeleteAdminUsers}>Delete admin_users</button>
                                <input className="form-control mb-2" value={idToDelete} onChange={(e) => setIdToDelete(e.target.value)} type="text"></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}