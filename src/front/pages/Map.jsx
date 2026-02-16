import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


export const Map = () => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const inputRef = useRef(null);
    const markersRef = useRef([]);
    const [storages, setStorages] = useState([]);
    const [mapReady, setMapReady] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchLat, setSearchLat] = useState(null);
    const [searchLng, setSearchLng] = useState(null);

    const navigate = useNavigate()

    const [searchData, setSearchData] = useState({
        location: "",
        lat: null,
        lng: null,
        checkin: "",
        checkout: ""
    });

    const handleSearch = () => {
        if (!searchData.lat || !searchData.lng) {
            alert("Selecciona una ciudad del desplegable.");
            return;
        }
        if (mapInstance.current) {
            mapInstance.current.setCenter({ lat: searchData.lat, lng: searchData.lng });
            mapInstance.current.setZoom(15);

        }

        const params = new URLSearchParams({
            loc: searchData.location,
            lat: searchData.lat,
            lng: searchData.lng,
            start: searchData.checkin,
            end: searchData.checkout
        }).toString();

    };


    useEffect(() => {

        const lat = searchParams.get('lat')
        const lng = searchParams.get('lng')
        if (lat && lng) {
            setSearchLat(parseFloat(lat));
            setSearchLng(parseFloat(lng));
            console.log("Busqueda", searchParams.get('loc'), lat, lng);
        }

        fetchStorages();

        if (window.google && window.google.maps) {
            initMap();
            initAutocomplete();
        } else {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places&loading=async`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                initMap();
                initAutocomplete();
                setTimeout(initDraggableMarker, 500);
            };

            document.head.appendChild(script);
        }

    }, []);

    // cuando se inicia el mapa lo qeu sale (añadir aqui los initdraggable etc)

    const initMap = () => {
        if (!mapRef.current) return;
        const center = searchLat && searchLng
            ? { lat: searchLat, lng: searchLng }
            : { lat: 40.416775, lng: -3.703790 };
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: searchLat ? 12 : 10,
        });
        setMapReady(true);
        initDraggableMarker(); 
    };

    // draggable

    const initDraggableMarker = () => {
        if (!mapInstance.current) return;

        const marker = new window.google.maps.Marker({
            position: mapInstance.current.getCenter(),
            map: mapInstance.current,
            draggable: true,
            title: "Arrastra para mover"
        });

        marker.addListener("dragend", () => {
            const position = marker.getPosition();
            const lat = position.lat();
            const lng = position.lng();

            setSearchData(prev => ({
                ...prev,
                lat,
                lng,
                location: "Posición personalizada"
            }));

            console.log("Nuevo centro:", lat, lng);
        });
    };

    const initAutocomplete = () => {
        if (!inputRef.current || !window.google?.maps?.places) return;
        const autocomplete = new
            window.google.maps.places.Autocomplete(inputRef.current);

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setSearchData(prev => ({
                ...prev,
                location: place.formatted_address,
                lat,
                lng
            }));

            if (mapInstance.current) {
                mapInstance.current.setCenter({ lat, lng });
                mapInstance.current.setZoom(13);
            }
        });
    };

    const fetchStorages = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/storage/map`);
            const data = await response.json();
            setStorages(data);
        } catch (error) {
            console.error("Error cargando storages:", error);
        }
    };

    // para dibujar los trasteros en el mapa
    useEffect(() => {
        if (!mapReady || !mapInstance.current) return;
        // para qeu no se qeuden las chincheetas de las busquedas anteriores
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        storages.forEach(storage => {
            const marker = new window.google.maps.Marker({
                position: {
                    lat: parseFloat(storage.latitude),
                    lng: parseFloat(storage.longitude),
                },
                map: mapInstance.current,
                title: `${storage.price}€`,
                // estilos para el draggable
                label: {
                    text: `${storage.price}€`,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px"
                }
            });
            const infoWindow = new window.google.maps.InfoWindow({
                content:
                    `<div style="color: black; padding: 5px;">
                <strong>${storage.price}€ / mes</strong><br>
                <span>${storage.size} m²</span>
            </div> `
            });
            marker.addListener("click", () => {
                infoWindow.open(mapInstance.current, marker);
            });

            markersRef.current.push(marker);
        });
    }, [storages, mapReady])

    useEffect(() => {
        if (searchLat && searchLng && mapInstance.current) {
            mapInstance.current.setCenter({ lat: searchLat, lng: searchLng });
            mapInstance.current.setZoom(15);
        }

    }, [searchLat, searchLng])

    return (
        // barra de busqeuda
        <div className="p-4">
            <div className="container pt-4 pb-5">
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
                            <button onClick={handleSearch} className="btn btn-danger w-100"> Buscar </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* // barra de busqeuda */}

            <div style={{ display: "flex", height: "100vh" }}>
                <div style={{ width: "50%", overflowY: "scroll", padding: "20px" }}>
                    <h2>Trasteros cercanos</h2>
                    {storages.map(storage => (
                        <div key={storage.storage_id} style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "15px", marginBottom: "15px", }} >
                            <h4>{storage.address}</h4>
                            <p>{storage.city}</p>
                            <p>{storage.size} m²</p>
                            <p><strong>{storage.price}€ / mes</strong></p>
                            <button className="btn btn-primary mt-2" onClick={() => navigate(`/storages/${storage.storage_id}`)} >Ver detalles</button>
                        </div>
                    ))}
                </div>
                <div style={{ width: "50%", height: "100vh", background: "grey" }}>
                    <div
                        ref={mapRef}
                        style={{ height: "100vh", width: "100%" }}
                    />
                </div>
            </div>
        </div>
    )
}