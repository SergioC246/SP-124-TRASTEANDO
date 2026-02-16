import React, { useState, useEffect, useRef } from 'react';

export const SearchHome = () => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapContainerRef = useRef(null);
    const [isLeafletReady, setIsLeafletReady] = useState(false);

    const [searchData, setSearchData] = useState({
        location: '',
        lat: 40.416775,
        lng: -3.703790,
        checkin: '',
        checkout: ''
    });

    // 1. Carga de Leaflet 
    useEffect(() => {
        //esto para si esta ya cargado no ahcer nada
        if (window.L) {
            setIsLeafletReady(true);
            return;
        }
//funciona sin nodemodules osea no hace falta npm install
        //estilos del mapa de leaflet para que cargue bien
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        // js ed leaflet las funciones del mapa de la web
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; //para descargar Leaflet donde hacerlo
        script.async = true; //no bloqeua la pagina para que cargue y espere al mapa
        script.onload = () => setIsLeafletReady(true); //inserta en head del documento el script y otros links
        document.head.appendChild(script);
    }, []);

    // 2. Inicialización del Mapa
    useEffect(() => {
        if (isLeafletReady && mapContainerRef.current && !mapRef.current) {
            const L = window.L;
            mapRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([searchData.lat, searchData.lng], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(mapRef.current);
// marcador principal el dragable
            markerRef.current = L.marker([searchData.lat, searchData.lng], { draggable: true }).addTo(mapRef.current);
// evento del draggable para actualizar latitud y longitud
            markerRef.current.on('dragend', function () {
                const position = markerRef.current.getLatLng(); //coordenadas
                console.log('Draggable:', position.lat, position.lng);
                setSearchData(prev => ({ ...prev, lat: position.lat, lng: position.lng }));
                // para qeu el draggable funcione
                mapRef.current.setView([position.lat, position.lng], 14); //para mover el ampa
                mapRef.current.invalidateSize();
            });

            setTimeout(() => mapRef.current.invalidateSize(), 500);
        }
    }, [isLeafletReady]); //para qeu se ejecute solo caundo leaf cargue

    // 3. Función de Búsqueda
    const handleSearch = async () => {
        if (!searchData.location) return;

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchData.location)}`);              
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lon);

                console.log("latitud y longitud:", newLat, newLng)

                mapRef.current.setView([newLat, newLng], 14);
                markerRef.current.setLatLng([newLat, newLng]);

                setSearchData(prev => ({ ...prev, lat: newLat, lng: newLng }));
            } else {
                alert("No se encontró la ubicación");
            }
        } catch (error) {
            console.error("Error en la búsqueda:", error);
        }
    };

    return (
        <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
            <div className="container pt-4" style={{ zIndex: 1000 }}>
                <div className="mx-auto" style={{ maxWidth: '900px' }}>
                    <div className="container mt-3">
                        <div className="row g-2 align-items-end border p-3 bg-white">
                            <div className="col-md-4">
                                <label className="d-block fw-bold mb-0 text-dark">Donde</label>
                                <input type="text" className="form-control border-0 p-0 shadow-none bg-transparent" placeholder="Madrid, Barcelona..." value={searchData.location} onChange={(e) => setSearchData({ ...searchData, location: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                            </div>
                            <div className="col-md-3">
                                <label className="d-block fw-bold mb-0 text-dark">Desde</label>
                                <input type="date" className="form-control border-0 p-0 shadow-none bg-transparent" value={searchData.checkin} onChange={(e) => setSearchData({ ...searchData, checkin: e.target.value })} />
                            </div>
                            <div className="col-md-3">
                                <label className="d-block fw-bold mb-0 text-dark">Hasta</label>
                                <input type="date" className="form-control border-0 p-0 shadow-none bg-transparent" value={searchData.checkout} onChange={(e) => setSearchData({ ...searchData, checkout: e.target.value })} />
                            </div>
                            <div className="col-md-2">
                                <button onClick={handleSearch} className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center shadow-sm float-end" style={{ width: '48px', height: '48px' }}>
                                    <i className="fas fa-search text-white"></i>
                                    {/* Si la librería Leaflet (L) aún no ha cargado en el navegador, muestra tres puntitos en el botón */}
                                    {!window.L && <span style={{ fontSize: '10px' }}>...</span>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-grow-1 mt-4 map" style={{ position: 'relative' }}>
                {!isLeafletReady ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-danger" role="status"></div>
                    </div>
                ) : (
                    <div ref={mapContainerRef} style={{ height: '100%', width: '100%', zIndex: 1 }}></div>
                )}
            </div>
        </div>
    );
};