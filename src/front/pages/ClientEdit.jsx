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
    photo_url: "", // 1. Añadimos foto
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // 2. Añadimos spinner de carga

  // Load client data

  useEffect(() => {
    getClients(id)
      .then((data) => {
        setForm({
          email: data.email,
          is_active: data.is_active,
          photo_url: data.photo_url || "", // 3. Cargamos URL si existe
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  //4. Función para subir fotos a Cloudinary

  const handleUploadPhoto = async (f) => {
    const file = f.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "topydai"); // 5. Preset de Cloudinary

    setUploading(true);

    try {
      const result = await fetch("https://api.cloudinary.com/v1_1/dofzpindm/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await result.json();

      if (data.secure_url) {
        setForm({ ...form, photo_url: data.secure_url });
      } else {
        
      }
    } catch (error) {
     
    } finally {
      setUploading(false);
    }
  };

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

    {/*Selección de archivos*/}

    <div className="mb-3">
      <label htmlFor="form-label">Cambiar foto de Perfil</label>
      <input type="file"
             className="form-control"
             onChange={handleUploadPhoto}
             disabled={uploading}
      />
      {uploading && <span 
                      className="spinner-border spinner-border-sm text-primary ms-2">
                    </span>}
    </div>
    
    {/*URL de la foto enviada pro Cloudinary*/}

    <div className="mb-3">
        {/* <label>URL de la foto</label> */}
        <input className="form-control bg-light"
              //  type="hidden"
               name="photo_url"
               value={form.photo_url}
               onChange={handleChange}
               placeholder="La URL de la foto"
        />
    </div>
    {/*Preview*/}

    {form.photo_url&& (
      <div className="mb-3">
        <img src={form.photo_url}
             alt="Preview" 
             className="img-thumbnail" 
             style={{width: "150px"}} 
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
