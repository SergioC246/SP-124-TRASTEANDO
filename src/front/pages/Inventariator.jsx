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
    const [imageUrl, setImageUrl] = useState(null); //

    const [uploading, setUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestionMeta, setSuggestionMeta] = useState(null);


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

    const uploadImage = async (file) => {

        if (!file) return null;

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
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

    const suggestCategory = async (secureUrl, token) => {

        const resp = await fetch(`${API_URL}api/products/suggest-category`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ image_url: secureUrl })
        });

        if (!resp.ok) return null;

        return await resp.json();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = store.tokenClient;
        if (!token) return alert("No autenticado");

        if (!name) return alert("Faltan campos");

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
        setImageFile(null);
        setImageUrl(null);
        setSuggestionMeta(null);

        loadProducts();
    };

    const handleImageSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);

        const token = store.tokenClient;
        if (!token) return;

        setIsAnalyzing(true);

        try {
            const secureUrl = await uploadImage(file);
            if (!secureUrl) return;

            setImageUrl(secureUrl);

            const suggestion = await suggestCategory(secureUrl, token);

            console.log("IA response:", suggestion);

            if (!suggestion) return;

            setSuggestionMeta(suggestion);

            if (suggestion.suggested_category_id != null) {
                setCategoryId(String(suggestion.suggested_category_id));
            }

            setName(prev => prev?.trim() ? prev : (suggestion.suggested_title ?? ""));
            setDescription(prev => prev?.trim() ? prev : (suggestion.suggested_description ?? ""));

        } finally {
            setIsAnalyzing(false);
        }
    };



    return (
        <div className="container mt-5">
            <h2>Inventariator V1</h2>

            <form onSubmit={handleSubmit} className="mb-4">
                {/* 1) PRIMERO: imagen */}
                <input
                    type="file"
                    className="form-control mb-2"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={isAnalyzing}
                />

                {/* loader */}
                {isAnalyzing && <p className="mb-2">🔎 Analizando imagen...</p>}

                {/* meta sugerencia */}
                {suggestionMeta && (
                    <small className="d-block mb-2">
                        Sugerido: {suggestionMeta.suggested_category_name}
                        {" "}
                        ({(suggestionMeta.confidence * 100).toFixed(0)}%)
                    </small>
                )}

                <hr />

                {/* 2) DESPUÉS: campos (IA debería rellenar, pero el user puede editar) */}
                <input
                    className="form-control mb-2"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isAnalyzing}
                />

                <input
                    className="form-control mb-2"
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isAnalyzing}
                />

                <select
                    className="form-select mb-2"
                    value={String(categoryId ?? "")}          // 👈 importante: coherencia
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={isAnalyzing}
                >
                    <option value="">Selecciona categoría</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={String(cat.id)}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* 3) botón */}
                <button
                    className="btn btn-primary"
                    disabled={isAnalyzing}
                >
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