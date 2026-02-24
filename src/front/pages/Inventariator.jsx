import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const Inventeriator = () => {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const userId = 1; // V1 fijo, luego vendrá JWT

    // Cargar categorías
    const loadCategories = async () => {
        const resp = await fetch(`${API_URL}/api/categories`);
        const data = await resp.json();
        setCategories(data);
    };

    // Cargar productos
    const loadProducts = async () => {
        const resp = await fetch(`${API_URL}/api/products?user_id=${userId}`);
        const data = await resp.json();
        setProducts(data);
    };

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !categoryId) return alert("Faltan campos");

        await fetch(`${API_URL}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                description,
                category_id: parseInt(categoryId),
                user_id: userId
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
            <h2>Inventeriator V1</h2>

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
                        <strong>{prod.name}</strong> — {prod.category?.name}
                        <br />
                        <small>{prod.description}</small>
                        <button
                            className="btn btn-sm btn btn-success btn-danger float-end"
                            onClick={async () => {
                                await fetch(`${API_URL}/api/products/${prod.id}`, {
                                    method: "DELETE"
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