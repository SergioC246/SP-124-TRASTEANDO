import { useEffect, useState } from "react";    
import { useNavigate, useParams } from "react-router-dom";
import { getCompany, editCompany } from "../utilsCompanies";

export const CompanyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    cif: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  // Cargar datos de la empresa
  useEffect(() => {
    getCompany(id)
      .then((data) => {
        setForm({
          name: data.name || "",
          cif: data.cif || "",
          email: data.email || "",
          address: data.address || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading company...</p>;

  const handleChange = (c) => {
    const { name, value } = c.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSave = () => {
    editCompany(id, form)
      .then(() => navigate("/companies/private"))
      .catch(console.error);
  };

  return (
    <div className="container mt-4">
      <h1>Edit Company</h1>

      <div className="mb-3">
        <label>Name</label>
        <input
          className="form-control"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label>CIF</label>
        <input
          className="form-control"
          name="cif"
          value={form.cif}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input
          className="form-control"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label>Address</label>
        <input
          className="form-control"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
      </div>

      <button className="btn btn-success" onClick={handleSave}>
        Save
      </button>

      <button
        className="btn btn-secondary ms-2"
        onClick={() => navigate("/companies/private")}
      >
        Cancel
      </button>
    </div>
  );
};