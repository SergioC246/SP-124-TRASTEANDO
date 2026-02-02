import { useEffect, useState } from "react";
import { getAllClients, createClient, editClient, deleteClient } from "../utilsClients.js";



export const Clients = () => {
    const [clients, setClients] = useState([]);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("list");

    // Load Clients
    const loadClients = () => {
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

    // Form handling
    const handleChange = (c) => {
        const { name, value, type, checked } = c.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    //Create or edit

    const handleSave = () => {
        const action = form.id
            ? editClient(form.id, {
                email: form.email,
                is_active: form.is_active
            })
            : createClient({
                email: form.email,
                password: form.password,
                is_active: form.is_active
            });

        action
            .then(() => {
                setForm(null);
                setMode("list");
                loadClients();
            })
            .catch(err => console.error(err));
    };

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
                    onClick={() => {
                        setMode("create");
                        setForm({
                            email: "",
                            password: "",
                            is_active: true
                        });
                    }}
                >
                    Create Client
                </button>

            </div>

            {/* ==== LIST ==== */}

            {mode === "list" && (
                <>
                    {clients.length === 0 ? (
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
                                            onClick={() => {
                                                setForm(client);
                                                setMode("details");
                                            }}
                                        >
                                            Details
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => {
                                                setForm(client);
                                                setMode("edit");
                                            }}
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
                    )}
                </>
            )}

            {/* ==== Form ==== */}
            {(mode === "create" || mode === "edit") && (
                <>
                    <h3 className="mt-4">
                        {mode === "edit" ? "Edit Client" : "New Client"}
                    </h3>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    {mode === "create" && (
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="form-check mb-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            name="is_active"
                            checked={form.is_active}
                            onChange={handleChange}
                        />
                        <label className="form-check-label">Active</label>
                    </div>

                    <button
                        type="button"
                        className="btn btn-success me-2"
                        onClick={handleSave}
                    >
                        Save
                    </button>

                    <button className="btn btn-secondary"
                        onClick={() => {
                            setForm(null);
                            setMode("list");
                        }}

                    >
                        Cancel
                    </button>
                </>
            )}

            {/* ==== Details ==== */}

            {mode === "details" && form && (
                <>
                    <h3 className="mt-4">Client details</h3>

                    <ul className="List-group mb-3">
                        <li className="list-group-item">
                            <strong>ID:</strong> {form.id}
                        </li>
                        <li className="list-group-item">
                            <strong>Email:</strong> {form.email}
                        </li>
                        <li className="list-group-item">
                            <strong>Status:</strong> {" "}
                            {form.is_active ? "Active" : "Inactive"}
                        </li>
                    </ul>

                    <button className="btn btn-secondary"
                        onClick={() => {
                            setForm(null);
                            setMode("list");
                        }}
                    >
                        Back
                    </button>
                </>
            )}    
        </div>
    );
};
