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

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const loadCategories = async () => {
        const resp = await fetch(`${API_URL}api/categories`);
        const data = await resp.json();
        setCategories(data);
    };

    const loadProducts = async () => {
        const token = store.tokenClient || localStorage.getItem("tokenClient");
        if (!token) return;
        const resp = await fetch(`${API_URL}api/products`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!resp.ok) return;
        const data = await resp.json();
        setProducts(data);
    };

    useEffect(() => { loadCategories(); }, []);
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
            const resp = await fetch("https://api.cloudinary.com/v1_1/dofzpindm/image/upload", { method: "POST", body: formData });
            const data = await resp.json();
            return data.secure_url || null;
        } finally { setUploading(false); }
    };

    const suggestCategory = async (secureUrl, token) => {
        const resp = await fetch(`${API_URL}api/products/suggest-category`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ image_url: secureUrl })
        });
        if (!resp.ok) return null;
        return await resp.json();
    };

    const resetForm = () => {
        setName(""); setDescription(""); setPlacement(""); setCategoryId("");
        setSuggestionMeta(null); setImageUrl(null); setImageFile(null); setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = store.tokenClient;
        if (!token) return alert("No autenticado");
        if (!name) return alert("Faltan campos");
        const resp = await fetch(`${API_URL}api/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ name, description, placement, category_id: parseInt(categoryId, 10), image_url: imageUrl }),
        });
        if (!resp.ok) return alert("Error creando producto");
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
            if (!suggestion) return;
            setSuggestionMeta(suggestion);
            if (suggestion.suggested_category_id != null) setCategoryId(String(suggestion.suggested_category_id));
            setName(prev => (prev?.trim() ? prev : (suggestion.suggested_title ?? "")));
            setDescription(prev => (prev?.trim() ? prev : (suggestion.suggested_description ?? "")));
        } finally { setIsAnalyzing(false); }
    };

    return (
        <div className="container py-5">
            {/* Header Sección */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold display-5 mb-1">Inventariator <span style={{ color: '#f24171' }}>v3</span></h2>
                    <p className="text-muted">Manage your belongings with AI-powered suggestions</p>
                </div>
                <button
                    className="btn btn-dark rounded-pill px-4 shadow-sm"
                    onClick={async () => {
                        const token = store.tokenClient;
                        if (!token) return;
                        const resp = await fetch(`${API_URL}api/products/export`, {
                            headers: { Authorization: `Bearer ${token}` }
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
                    <i className="fa-solid fa-download me-2"></i> Export CSV
                </button>
            </div>

            <div className="row g-4">
          
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: "2rem", borderRadius: "25px" }}>
                        <h5 className="fw-bold mb-4">Add New Product</h5>
                        <form onSubmit={handleSubmit}>
                       
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-uppercase text-muted">Product Image</label>
                                <div 
                                    className="d-flex flex-column align-items-center justify-content-center border border-2 border-dashed rounded-4 p-3 bg-light position-relative"
                                    style={{ minHeight: "200px", cursor: "pointer", borderColor: "#dee2e6" }}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {(previewUrl || imageUrl) ? (
                                        <img
                                            src={imageUrl || previewUrl}
                                            alt="preview"
                                            className="img-fluid rounded-3 shadow-sm"
                                            style={{ maxHeight: "180px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div className="text-center text-muted">
                                            <i className="fa-solid fa-cloud-arrow-up fs-2 mb-2"></i>
                                            <p className="mb-0 small">Click to upload photo</p>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="d-none"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        disabled={isAnalyzing || uploading}
                                    />
                                    
                                    {(uploading || isAnalyzing) && (
                                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 rounded-4">
                                            <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                            <span className="small fw-bold">{uploading ? "Uploading..." : "Analyzing..."}</span>
                                        </div>
                                    )}
                                </div>
                                {suggestionMeta && (
                                    <div className="mt-2 badge bg-primary-subtle text-primary border border-primary-subtle w-100 py-2">
                                        <i className="fa-solid fa-robot me-1"></i> AI suggests: {suggestionMeta.suggested_category_name} ({(suggestionMeta.confidence * 100).toFixed(0)}%)
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <input
                                    className="form-control border-0 bg-light py-2 px-3 rounded-3"
                                    placeholder="Product Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isAnalyzing || uploading}
                                />
                            </div>

                            <div className="mb-3">
                                <textarea
                                    className="form-control border-0 bg-light py-2 px-3 rounded-3"
                                    placeholder="Brief description..."
                                    rows="2"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={isAnalyzing || uploading}
                                />
                            </div>

                            <div className="mb-3">
                                <select
                                    className="form-select border-0 bg-light py-2 px-3 rounded-3"
                                    value={String(categoryId ?? "")}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    disabled={isAnalyzing || uploading}
                                >
                                    <option value="">Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light rounded-start-3"><i className="fa-solid fa-location-dot text-muted"></i></span>
                                    <input
                                        className="form-control border-0 bg-light py-2 rounded-end-3"
                                        placeholder="Physical placement"
                                        value={placement}
                                        onChange={(e) => setPlacement(e.target.value)}
                                        disabled={isAnalyzing || uploading}
                                    />
                                </div>
                            </div>

                            <button 
                                className="btn-primary-custom w-100 py-3 rounded-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" 
                                disabled={isAnalyzing || uploading}
                            >
                                <i className="fa-solid fa-plus"></i> Create Product
                            </button>
                        </form>
                    </div>
                </div>
                <div className="col-lg-8">
                    <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                        My Products 
                        <span className="badge bg-light text-dark border rounded-pill fw-normal fs-6">{products.length}</span>
                    </h4>

                    {products.length === 0 ? (
                        <div className="text-center py-5 bg-light rounded-5 border border-dashed">
                            <p className="text-muted mb-0">No products found. Start by adding one!</p>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {products.map((prod) => (
                                <div key={prod.id} className="col-md-6 col-xl-4">
                                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden product-card">
                                        <div className="position-relative">
                                            <img
                                                src={prod.image_url || "https://via.placeholder.com/300x200?text=No+Image"}
                                                className="card-img-top"
                                                alt={prod.name}
                                                style={{ height: "180px", objectFit: "cover" }}
                                            />
                                            <span className="position-absolute top-0 end-0 m-2 badge bg-white text-dark shadow-sm">
                                                {prod.category?.name}
                                            </span>
                                        </div>
                                        
                                        <div className="card-body p-3">
                                            <h6 className="fw-bold mb-1 text-truncate">{prod.name}</h6>
                                            <p className="small text-muted mb-3 text-truncate-2" style={{ height: "36px", overflow: "hidden" }}>
                                                {prod.description}
                                            </p>

                                            <div className="bg-light p-2 rounded-3 mb-3">
                                                {editingId === prod.id ? (
                                                    <div className="d-flex gap-2">
                                                        <input
                                                            className="form-control form-control-sm border-0 shadow-none"
                                                            value={editingPlacement}
                                                            onChange={(e) => setEditingPlacement(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <button
                                                            className="btn btn-sm btn-success rounded-circle"
                                                            onClick={async () => {
                                                                const token = store.tokenClient;
                                                                if (!token) return;
                                                                await fetch(`${API_URL}api/products/${prod.id}`, {
                                                                    method: "PUT",
                                                                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                                                    body: JSON.stringify({ placement: editingPlacement }),
                                                                });
                                                                setEditingId(null);
                                                                loadProducts();
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-check"></i>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex align-items-center gap-2 small">
                                                        <i className="fa-solid fa-location-dot text-primary"></i>
                                                        <span className="text-truncate">{prod.placement || "No location"}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary w-100 rounded-3 border-light-subtle"
                                                    onClick={() => {
                                                        setEditingId(prod.id);
                                                        setEditingPlacement(prod.placement || "");
                                                    }}
                                                >
                                                    <i className="fa-solid fa-pen-to-square me-1"></i> Edit
                                                </button>
                                                <button
                                                    className="btn-primary-custom btn-sm btn-outline-danger px-3 rounded-3 border-light-subtle"
                                                    onClick={async () => {
                                                        if (!window.confirm("Delete product?")) return;
                                                        const token = store.tokenClient;
                                                        if (!token) return;
                                                        await fetch(`${API_URL}api/products/${prod.id}`, {
                                                            method: "DELETE",
                                                            headers: { Authorization: `Bearer ${token}` },
                                                        });
                                                        loadProducts();
                                                    }}
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};