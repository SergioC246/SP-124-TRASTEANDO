import { useEffect, useState, useRef } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const Inventariator = () => {

    const { store } = useGlobalReducer();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [placement, setPlacement] = useState("");

    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestionMeta, setSuggestionMeta] = useState(null);

    const fileInputRef = useRef(null);
    
    

    // Limpieza del previewURL
    useEffect(() => {
            return () => {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
            };
        }, [previewUrl]);

    // Cargar categorías
    const loadCategories = async () => {
        const resp = await fetch(`${API_URL}api/categories`);
        const data = await resp.json();
        setCategories(data);
    };

    // Cargar productos
    const loadProducts = async () => {

        const token = store.tokenClient || localStorage.getItem("tokenClient");
        if (!token) return;

        const resp = await fetch(`${API_URL}api/products`, {
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
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "topydai");

            const resp = await fetch(
                "https://api.cloudinary.com/v1_1/dofzpindm/image/upload",
                { method: "POST", body: formData }
            );

            const data = await resp.json();
            return data.secure_url || null;
        } finally {
            setUploading(false);
        }
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

    const resetForm = () => {
        setName("");
        setDescription("");
        setPlacement("");
        setCategoryId("");
        setSuggestionMeta(null);
        setImageUrl(null);
        setImageFile(null);
        setPreviewUrl(null);

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = store.tokenClient;
        if (!token) return alert("No autenticado");

        if (!name) return alert("Faltan campos");

        const resp = await fetch(`${API_URL}api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                description,
                placement,
                category_id: parseInt(categoryId, 10),
                image_url: imageUrl,
            }),
        });

        if (!resp.ok) {
            const error = await resp.json();
            return alert(error.msg || "Error creando producto");
        }
        
        await loadProducts();
        resetForm(); // <- 1 sola vez
    };

    const handleImageSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file)); // ✅ preview inmediata

        const token = store.tokenClient || localStorage.getItem("tokenClient");
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

            setName(prev => (prev?.trim() ? prev : (suggestion.suggested_title ?? "")));
            setDescription(prev => (prev?.trim() ? prev : (suggestion.suggested_description ?? "")));
        } finally {
            setIsAnalyzing(false);
        }
    };


    return (
        <div className="container mt-5">
            <h2>Inventariator v3</h2>

        <form onSubmit={handleSubmit} className="mb-4">
            {/* 1) Imagen */}
            <input
                ref={fileInputRef}
                type="file"
                className="form-control mb-2"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={isAnalyzing || uploading}
            />

            {(previewUrl || imageUrl) && (
                <div className="mb-2">
                    <img
                        src={imageUrl || previewUrl}
                        alt="preview"
                        style={{
                            width: "160px",
                            height: "160px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            display: "block",
                        }}
                    />
                </div>
            )}

            {(uploading || isAnalyzing) && (
                <p className="mb-2">🔎 {uploading ? "Subiendo imagen..." : "Analizando imagen..."}</p>
            )}

            {suggestionMeta && (
                <small className="d-block mb-2">
                    Sugerido: {suggestionMeta.suggested_category_name}{" "}
                    ({(suggestionMeta.confidence * 100).toFixed(0)}%)
                </small>
            )}

            <hr />

            {/* 2) Campos */}
            <input
                className="form-control mb-2"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAnalyzing || uploading}
            />

            <input
                className="form-control mb-2"
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isAnalyzing || uploading}
            />

            <select
                className="form-select mb-2"
                value={String(categoryId ?? "")}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isAnalyzing || uploading}
            >
                <option value="">Selecciona categoría</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <input
                className="form-control mb-2"
                placeholder="Ubicación física (Caja 3 · Estantería A · Balda 2)"
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                disabled={isAnalyzing || uploading}
            />

            <button className="btn btn-primary" disabled={isAnalyzing || uploading}>
                Crear Producto
            </button>
        </form>

        <hr />

        <h4>Mis Productos</h4>

        {products.length === 0 && <p>No hay productos</p>}

        <ul className="list-group">
            {products.map((prod) => (
                <li key={prod.id} className="list-group-item">
                    {prod.image_url && (
                        <img
                            src={prod.image_url}
                            alt="product"
                            style={{
                                width: "100px",
                                borderRadius: "8px",
                                marginBottom: "8px",
                                display: "block",
                            }}
                        />
                    )}

                    <strong>{prod.name}</strong> — {prod.category?.name}
                    <br />
                    <small>{prod.description}</small>
                    {prod.placement && (
                        <div>
                            <small>📍 {prod.placement}</small>
                        </div>
                    )}
                    <button
                        className="btn btn-sm btn btn-danger float-end"
                        onClick={async () => {
                            const token = store.tokenClient;
                            if (!token) return;

                            await fetch(`${API_URL}api/products/${prod.id}`, {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
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