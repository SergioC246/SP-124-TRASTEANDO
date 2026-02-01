import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClients } from "../store/api";

export const Clients = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
      getClients().then(data => setClients(data));
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
    )
}