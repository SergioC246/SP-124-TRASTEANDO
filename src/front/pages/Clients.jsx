import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export const Clients = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`)
        .then(res => res.json())
    .then(data => setClients(data));
    }, []);

    return (
        <div>
            <h1>Clients</h1>
            
            {clients.length === 0 && <p>No clients found</p>}

            <ul>
             {clients.map(client => (
                <li key={client.id}>
                    <strong>{client.email}</strong> : {" "}
                    {client.is_active ? "Active" : "Inactive"}{" "}
                    <link to={`/clients/${client.id}`}>View</link>
                </li>
             ))}
            </ul>            
        </div>
    );
};