import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

const API_URL = import.meta.env.VITE_BACKEND_URL;


export const Inventariator = () => {

    const { store } = useGlobalReducer();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);


    // Cargar categorías
    const loadCategories = async () => {
        const resp = await fetch(`${API_URL}/api/categories`);
        const data = await resp.json();
        setCategories(data);
    };

    // Cargar productos
    const loadProducts = async () => {

        const token = store.tokenClient || localStorage.getItem("tokenClient");
        if (!token) return;

        const resp = await fetch(`${API_URL}/api/products`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!resp.ok) {
            console.log("Error loading products", resp.status);
            return;
        }

        const data = await resp.json();
        setProducts(data);
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (store.tokenClient || localStorage.getItem("tokenClient")) {
            loadProducts();
        }
    }, [store.tokenClient]);

    const uploadImage = async () => {

        if (!imageFile) return null;

        setUploading(true);

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "topydai");

        const resp = await fetch(
            "https://api.cloudinary.com/v1_1/dofzpindm/image/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await resp.json();
        setUploading(false);

        return data.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !categoryId) return alert("Faltan campos");

        const token = store.tokenClient;
        if (!token) return alert("No autenticado");

        const imageUrl = imageFile ? await uploadImage() : null;
        console.log("IMAGE URL:", imageUrl);


        const resp = await fetch(`${API_URL}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                description,
                category_id: parseInt(categoryId),
                image_url: imageUrl 
            })
        });

        if (!resp.ok) {
            const error = await resp.json();
            return alert(error.msg || "Error creando producto");
        }

        setName("");
        setDescription("");
        setCategoryId("");

        loadProducts();
    };

    return (
        <div className="container mt-5">
            <h2>Inventariator V1</h2>

            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    className="form-control mb-2"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="form-control mb-2"
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <select
                    className="form-select mb-2"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">Selecciona categoría</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <input
                    type="file"
                    className="form-control mb-2"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />

                <button className="btn btn-primary">
                    Crear Producto
                </button>
            </form>

            <hr />

            <h4>Mis Productos</h4>

            {products.length === 0 && <p>No hay productos</p>}

            <ul className="list-group">
                {products.map(prod => (
                    <li key={prod.id} className="list-group-item">
                        {prod.image_url && (
                            <img
                                src={prod.image_url}
                                alt="product"
                                style={{
                                    width: "100px",
                                    borderRadius: "8px",
                                    marginBottom: "8px",
                                    display: "block"
                                }}
                            />
                        )}

                        <strong>{prod.name}</strong> — {prod.category?.name}
                        <br />
                        <small>{prod.description}</small>
                        <button
                            className="btn btn-sm btn btn-success btn-danger float-end"
                            onClick={async () => {
                                const token = store.tokenClient;
                                if (!token) return;

                                await fetch(`${API_URL}/api/products/${prod.id}`, {
                                    method: "DELETE",
                                    headers: {
                                        "Authorization": `Bearer ${token}`
                                    }
                                });
                                loadProducts();
                            }}
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};