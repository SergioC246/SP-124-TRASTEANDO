import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStorage } from "../utilsStorages.js";


export const StorageDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [storage, setStorage] = useState(null);

    useEffect(() => {
        getStorage(id)
            .then((data) => setStorage(data))
            .catch(console.error);
    }, [id]);

    if (!storage) return <p>Loading storage...</p>;

    return (
        <div className="container mt-4">
            <h1>Storage Details</h1>
         
        <ul className="list-group mb-3">
            <li className="list-group-item">
               <strong>ID:</strong> {storage.id}
            </li>
            <li className="list-group-item">
               <strong>Size:</strong> {storage.size}
            </li>
            <li className="list-group-item">
               <strong>Price:</strong> {storage.price} €
            </li>
            <li className="list-group-item">
               <strong>Status:</strong>{" "}
               {storage.status === "available"
               ? "Available" : "Occupied"}
            </li>
            <li className="list-group-item">
               <strong>Location ID:</strong> {storage.location_id}
            </li>
        </ul>

        <button className="btn btn-secondary"
                onClick={() => navigate("/storages")}
         >
            Back
         </button>
    </div > 
   );
  };