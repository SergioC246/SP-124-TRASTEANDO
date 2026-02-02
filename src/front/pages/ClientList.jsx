import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClients, deleteClient } from "../utilsClients.js";
import { ClientsList } from "./pages/ClientList";



export const ClientsList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load Clients
    const loadClients = () => {
        setLoading(true);
        getAllClients()
            .then(data => {
                setClients(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadClients()
    }, []);

    //Delete

    const handleDelete = (id) => {
        if (!confirm("Are you sure to delete this client?"))
            return;

        deleteClient(id)
            .then(loadClients)
            .catch(err => console.error(err));
    };

    if (loading) return <p>Loading clients...</p>;


    return (
        <div className="container mt-4">

            <div className="d-flex gap-3 mb-4 justify-content-center">


                <button className="btn btn-success"
                    onClick={() => navigate("/clients/new")
                        >
                        Create Client
                </button>


        </div>          
                    
        {
        clients.length === 0 ? (
            <p>No clients found</p>
        ) : (
        <ul className="list-group">
            {clients.map(client => (
                <li
                    key={client.id}
                    className="list-group-item d-flex 
                             justify-content-between align-items-center"
                >
                    <span>
                        <strong>{client.email}</strong> : {" "}
                        {client.is_active ? "Active" : "Inactive"}
                    </span>

                    <div>
                        <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => navigate(`/clients/${client.id}`)}
                        >
                            Details
                        </button>

                        <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => navigate(`/clients/${client.id}/edit`)}
                        >
                            Edit
                        </button>

                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(client.id)}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )
    }  
                      </div > 
                    );
                };