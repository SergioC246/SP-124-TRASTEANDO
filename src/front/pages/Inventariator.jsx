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
    const [editingId, setEditingId] = useState(null);
    const [editingPlacement, setEditingPlacement] = useState("");

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
        resetForm();
    };

    const handleImageSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));

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
        <div className="container py-5" style={{ maxWidth: "1100px" }}>
            {/* Encabezado */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                <div>
                    <h2 className="fw-bold display-6 mb-1">Inventariator <span className="text-primary">v3</span></h2>
                    <p className="text-muted mb-0">Gestiona tus pertenencias con el poder de la IA</p>
                </div>
                <button
                    className="btn btn-dark btn-lg rounded-pill px-4 shadow-sm fs-6"
                    onClick={async () => {
                        const token = store.tokenClient;
                        if (!token) return;

                        const resp = await fetch(`${API_URL}api/products/export`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });

                        const blob = await resp.blob();
                        const url = window.URL.createObjectURL(blob);

                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "mis_productos.csv";
                        a.click();

                        window.URL.revokeObjectURL(url);
                    }}
                >
                    <i className="bi bi-download me-2"></i> Exportar CSV
                </button>
            </div>

            <div className="row g-4">
                {/* Columna Izquierda: Formulario */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: "2rem", borderRadius: "24px" }}>
                        <h5 className="fw-bold mb-4">Añadir Producto</h5>
                        
                        <form onSubmit={handleSubmit}>
                            {/* Selector de Imagen Mejorado */}
                            <div className="mb-4 text-center">
                                <div 
                                    className="position-relative mx-auto border border-2 border-dashed rounded-4 d-flex align-items-center justify-content-center overflow-hidden bg-light"
                                    style={{ width: "100%", height: "200px", cursor: "pointer", borderColor: "#dee2e6" }}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {(previewUrl || imageUrl) ? (
                                        <img
                                            src={imageUrl || previewUrl}
                                            alt="preview"
                                            className="w-100 h-100"
                                            style={{ objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div className="text-muted">
                                            <i className="bi bi-camera fs-1 d-block mb-1"></i>
                                            <span className="small">Subir foto</span>
                                        </div>
                                    )}

                                    {/* Overlay de Carga */}
                                    {(uploading || isAnalyzing) && (
                                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white bg-opacity-75">
                                            <div className="spinner-border text-primary spinner-border-sm mb-2" role="status"></div>
                                            <span className="small fw-bold text-dark text-center px-2">
                                                {uploading ? "Subiendo..." : "IA analizando..."}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="d-none"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    disabled={isAnalyzing || uploading}
                                />
                                
                                {suggestionMeta && (
                                    <div className="mt-2 text-primary small fw-semibold bg-primary-subtle py-1 px-2 rounded-pill d-inline-block">
                                        <i className="bi bi-robot me-1"></i> Sugerido: {suggestionMeta.suggested_category_name}
                                    </div>
                                )}
                            </div>

                            <input
                                className="form-control border-0 bg-light mb-3 py-2 px-3 rounded-3"
                                placeholder="Nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isAnalyzing || uploading}
                            />

                            <textarea
                                className="form-control border-0 bg-light mb-3 py-2 px-3 rounded-3"
                                placeholder="Descripción"
                                rows="2"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isAnalyzing || uploading}
                            />

                            <select
                                className="form-select border-0 bg-light mb-3 py-2 px-3 rounded-3"
                                value={String(categoryId ?? "")}
                                onChange={(e) => setCategoryId(e.target.value)}
                                disabled={isAnalyzing || uploading}
                            >
                                <option value="">Categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            <div className="input-group mb-4">
                                <span className="input-group-text border-0 bg-light rounded-start-3">
                                    <i className="bi bi-geo-alt text-muted"></i>
                                </span>
                                <input
                                    className="form-control border-0 bg-light py-2 rounded-end-3"
                                    placeholder="Ubicación física"
                                    value={placement}
                                    onChange={(e) => setPlacement(e.target.value)}
                                    disabled={isAnalyzing || uploading}
                                />
                            </div>

                            <button 
                                className="btn btn-primary w-100 py-2 rounded-3 fw-bold shadow-sm" 
                                disabled={isAnalyzing || uploading}
                            >
                                {isAnalyzing || uploading ? "Procesando..." : "Crear Producto"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Columna Derecha: Listado */}
                <div className="col-lg-8">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h4 className="fw-bold mb-0">Mis Productos</h4>
                        <span className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-normal">
                            Total: {products.length}
                        </span>
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-5 bg-white shadow-sm rounded-4 border border-dashed">
                            <i className="bi bi-box-seam display-4 text-light-emphasis d-block mb-3"></i>
                            <p className="text-muted">No hay productos registrados todavía.</p>
                        </div>
                    )}

                    <div className="row g-3">
                        {products.map((prod) => (
                            <div key={prod.id} className="col-12 col-md-6">
                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                    <div className="d-flex align-items-center p-3">
                                        {/* Imagen Miniatura */}
                                        <div className="flex-shrink-0">
                                            {prod.image_url ? (
                                                <img
                                                    src={prod.image_url}
                                                    alt="product"
                                                    className="rounded-3 shadow-sm"
                                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                                                    <i className="bi bi-image text-muted"></i>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info del Producto */}
                                        <div className="flex-grow-1 ms-3 overflow-hidden">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="overflow-hidden">
                                                    <h6 className="fw-bold mb-0 text-truncate">{prod.name}</h6>
                                                    <span className="badge bg-primary-subtle text-primary small fw-normal mb-1">
                                                        {prod.category?.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="small text-muted mb-1 text-truncate" style={{ maxWidth: "100%" }}>
                                                {prod.description}
                                            </p>
                                        </div>

                                        {/* Acciones */}
                                        <div className="ms-2 d-flex flex-column gap-1">
                                            <button
                                                className="btn btn-sm btn-light text-primary rounded-circle shadow-none"
                                                onClick={() => {
                                                    setEditingId(prod.id);
                                                    setEditingPlacement(prod.placement || "");
                                                }}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-light text-danger rounded-circle shadow-none"
                                                onClick={async () => {
                                                    if (!window.confirm("¿Eliminar producto?")) return;
                                                    const token = store.tokenClient;
                                                    if (!token) return;
                                                    await fetch(`${API_URL}api/products/${prod.id}`, {
                                                        method: "DELETE",
                                                        headers: { Authorization: `Bearer ${token}` },
                                                    });
                                                    loadProducts();
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Pie de la card con Ubicación */}
                                    <div className="card-footer bg-light border-0 px-3 py-2">
                                        {editingId === prod.id ? (
                                            <div className="d-flex gap-2 align-items-center">
                                                <input
                                                    className="form-control form-control-sm border-primary"
                                                    value={editingPlacement}
                                                    onChange={(e) => setEditingPlacement(e.target.value)}
                                                    autoFocus
                                                />
                                                <button
                                                    className="btn btn-sm btn-success rounded-3 py-0 px-2"
                                                    style={{ height: "31px" }}
                                                    onClick={async () => {
                                                        const token = store.tokenClient;
                                                        if (!token) return;
                                                        await fetch(`${API_URL}api/products/${prod.id}`, {
                                                            method: "PUT",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                Authorization: `Bearer ${token}`,
                                                            },
                                                            body: JSON.stringify({ placement: editingPlacement }),
                                                        });
                                                        setEditingId(null);
                                                        loadProducts();
                                                    }}
                                                >
                                                    <i className="bi bi-check-lg"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-geo-alt text-primary small me-1"></i>
                                                <small className="text-muted fw-semibold">
                                                    {prod.placement || "Sin ubicación"}
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};