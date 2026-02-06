import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStoragesOverview, deleteStorage } from "../utilsStorages.js";


export const StorageList = () => {
    const [storages, setStorages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load Storages
    const loadStorages = () => {
        setLoading(true);
        getAllStoragesOverview()
            .then(data => {
                setStorages(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadStorages()
    }, []);

    //Delete

    const handleDelete = (id) => {
        if (!confirm("Are you sure to delete this storage?"))
            return;

        deleteStorage (id)
            .then(loadStorages)
            .catch(err => console.error(err));
    };

    if (loading) return <p>Loading storages...</p>;


    return (
        <div className="container mt-4">

            <div className="d-flex gap-3 mb-4 justify-content-center">


                <button className="btn btn-success"
                    onClick={() => navigate("/storages/create")}
                >
                        Create Storage
                </button>


            </div>          
        {storages.length === 0 ? (
            <p>No storages found</p>
        ) : (
        <ul className="list-group">
            {storages.map(storage => (
                <li
                    key={storage.id}
                    className="list-group-item d-flex 
                             justify-content-between align-items-center"
                >
                    <span>
                        <strong class= "text-primary fs-4" >{storage.city}</strong> - <strong class="text-secondary">{storage.company_name}</strong>
                         - {storage.size} - {storage.price} € - {storage.status === "Available"
               ?        <em className="text-success"> Available</em> : <em className="text-danger"> Occupied</em>}
                    </span>

                    <div>
                        <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => navigate(`/storages/${storage.id}`)}
                        >
                            Details
                        </button>

                        <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => navigate(`/storages/${storage.id}/edit`)}
                        >
                            Edit
                        </button>

                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(storage.id)}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )}  
                      </div > 
                    );
                };