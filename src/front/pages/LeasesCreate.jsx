import { useNavigate } from "react-router-dom"
import { createLease } from "../utilsLeases"
import { useState } from "react"

export const LeasesCreate = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        start_date: "",
        end_date: "",
        status: true,
        client_id: "",
        storage_id: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === "status" ? value === "true" : value;

        setFormData({
            ...formData,
            [name]: finalValue
        })
    }


    const handleCreateLease = async (e) => {
        e.preventDefault();
        try {
            await createLease({
                ...formData,
                client_id: Number(formData.client_id),
                storage_id: Number(formData.storage_id),
            });

            navigate("/leases");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="container mt-5">
                <h1 className="text-start mb-4">New Lease Agreement</h1>

                <form onSubmit={handleCreateLease} className="card p-4 shadow-sm">
                    <div className="mb-3">
                        <label className="form-label d-block text-start fw-bold">Start date</label>
                        <input type="date" className="form-control" name="start_date" value={formData.start_date} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label d-block text-start fw-bold">End date</label>
                        <input type="date" className="form-control" name="end_date" value={formData.end_date} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label d-block text-start fw-bold">Lease Status</label>
                        <select className="form-select" name="status" value={formData.status.toString()} onChange={handleChange}>
                            <option value="true">Active</option>
                            <option value="false">Not Active</option>
                        </select>
                    </div>

                    {/* los ids */}

                    <div className="mb-3">
                        <label className="form-label d-block text-start fw-bold">Client ID</label>
                        <input type="number" className="form-control" name="client_id" value={formData.client_id} onChange={handleChange} placeholder="Enter Client ID" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label d-block text-start fw-bold">Storage ID</label>
                        <input type="number" className="form-control" name="storage_id" value={formData.storage_id} onChange={handleChange} placeholder="Enter Storage ID" required />
                    </div>

                    <div className="mt-3 p-3 bg-light rounded-3 border text-start">
                        <div className="text-muted small fw-bold text-uppercase mb-1">Link Information</div>
                        <span className="d-block text-secondary">Client ID: <span className="text-dark">{formData.client_id || "Not assigned"}</span></span>
                        <span className="d-block text-secondary">Storage Unit ID: <span className="text-dark">{formData.storage_id || "Not assigned"}</span></span>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                        <button type="button" className="btn btn-secondary w-50 py-2" onClick={() => navigate("/leases")}>Cancel</button>
                        <button type="submit" className="btn btn-primary w-50 py-2">Create Lease </button>
                    </div>
                </form>
            </div>

        </>
    )
}