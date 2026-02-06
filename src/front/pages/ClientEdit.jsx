import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClients, editClient } from "../utilsClients.js";

//Edit

export const ClientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(true);

  // Load client data

  useEffect(() => {
    getClients(id)
      .then((data) => {
        setForm({
          email: data.email,
          is_active: data.is_active,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading client...</p>;

  const handleChange = (c) => {
    const { name, value, type, checked } = c.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    editClient(id, form)
      .then(() => navigate("/clients"))
      .catch(console.error);
  };

  return (
    <div className="container mt-4">
      <h1>Edit Client</h1>

      <div className="mb-3">
        <label>Email</label>
        <input
          className="form-control"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>

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

      <button className="btn btn-success" onClick={handleSave}>
        Save
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => navigate("/clients")}
      >
        Cancel
      </button>
    </div>
  );
};
