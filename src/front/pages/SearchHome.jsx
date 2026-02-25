import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStoragesOverview } from "../utilsStorages";


export const SearchHome = () => {
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const autocompleteRef = useRef(null);
    const [storages, setStorages] = useState([])

    const [searchData, setSearchData] = useState({
        location: "",
        lat: null,
        lng: null,
        checkin: "",
        checkout: ""
    });

    useEffect(() => {
        //  para inicializar el autocomplete
        const initAutocomplete = () => {
            if (!inputRef.current || autocompleteRef.current) return;

            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
            autocompleteRef.current.addListener("place_changed", () => {
                const place = autocompleteRef.current.getPlace();
                if (!place.geometry) return;

                setSearchData(prev => ({
                    ...prev,
                    location: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                }));
            });
        };
        //  carga única
        if (window.google && window.google.maps && window.google.maps.places) {
            initAutocomplete();

        } else {
            const existingScript = document.getElementById("google-maps-script");
            if (!existingScript) {
                const script = document.createElement("script");
                script.id = "google-maps-script";
                script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    initAutocomplete();
                };
                document.head.appendChild(script);
            } else {
                existingScript.addEventListener("load", initAutocomplete);
            }
        }
    }, []);

    useEffect(() => {
        fetchStorages();
    }, [])

    const handleSearch = () => {
        if (!searchData.lat || !searchData.lng) {
            alert("Selecciona una ciudad del desplegable.");
            return;
        }
        const params = new URLSearchParams({
            loc: searchData.location,
            lat: searchData.lat,
            lng: searchData.lng,
            checkin: searchData.checkin,
            checkout: searchData.checkout
        }).toString();

        navigate(`/search/map?${params}`);
    };

    // para traerme los storages
    const fetchStorages = async () => {
        try {
            // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/storage/map`);
            const data = await getAllStoragesOverview(searchData);
            setStorages(data);
        } catch (error) {
            console.error("Error cargando storages:", error);
        }
    }


    return (
        // search bar
        <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
            <div className="container pt-4">
                <div className="mx-auto" style={{ maxWidth: "900px" }}>
                    <div className="row g-2 align-items-end border p-3 bg-white shadow-sm rounded">
                        <div className="col-md-4">
                            <label className="fw-bold">Dónde</label>
                            <input ref={inputRef} type="text" className="form-control" placeholder="Madrid, Barcelona..." value={searchData.location} onChange={(e) => setSearchData({ ...searchData, location: e.target.value, lat: null, lng: null })} />
                        </div>
                        <div className="col-md-3">
                            <label className="fw-bold">Desde</label>
                            <input type="date" className="form-control" value={searchData.checkin} onChange={(e) => setSearchData({ ...searchData, checkin: e.target.value })} />
                        </div>
                        <div className="col-md-3">
                            <label className="fw-bold">Hasta</label>
                            <input type="date" className="form-control" value={searchData.checkout} onChange={(e) => setSearchData({ ...searchData, checkout: e.target.value })} />
                        </div>
                        <div className="col-md-2">
                            <button onClick={handleSearch} className="btn btn-danger w-100"> <i className="fa fa-search" aria-hidden="true"></i> </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* trasteros */}
            <div className="container py-5">
                <h3 className="fw-bold mb-4">Trasteros disponibles</h3>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    {storages.map(storage => (
                        <div key={storage.id} className="col">
                            <div className="card h-100 border-0 shadow-sm rounded-3 p-3 bg-white">
                                {/* CONTENEDOR DE IMAGEN ACTUALIZADO */}
                                <div className="rounded mb-3" style={{ height: "150px", overflow: "hidden", backgroundColor: "#eee" }}>
                                    <img
                                        src={storage.photo || "https://images.unsplash.com/photo-1581404917829-5a5d096770db?auto=format&fit=crop&q=80&w=400"}
                                        alt={storage.city}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1581404917829-5a5d096770db?auto=format&fit=crop&q=80&w=400"; }}
                                    />
                                </div>

                                <h4 className="fw-bold mb-1 text-capitalize pb-1">{storage.city}</h4>
                                <h5 className="mb-1 text-capitalize" style={{ fontSize: "1rem" }}>{storage.company_name}</h5>
                                <p className="text-muted small mb-1">{storage.size} m²</p>
                                <p className="fw-bold mt-auto mb-0">{storage.price}€ / mes</p>
                                <button className="btn btn-primary mt-2 w-100" onClick={() => navigate(`/client/private/storage/${storage.id}`)} >
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};