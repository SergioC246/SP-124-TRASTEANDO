import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import video from "../assets/img/video.mp4"

export const Home = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    location: "",
    lat: null,
    lng: null,
    checkin: "",
    checkout: ""
  });

  // autocomplete
  useEffect(() => {
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
    if (window.google?.maps?.places) initAutocomplete();
  }, []);

  // 2. Cargar Ubicaciones Reales (Featured Locations)
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const token = store.tokenClient;
        const resp = await fetch(`${backendUrl}/api/location`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await resp.json();
        if (resp.ok) setLocations(data);
      } catch (err) {
        console.error("Error loading locations", err);
      } finally {
        setLoading(false);
      }
    };
    loadLocations();
  }, [store.tokenClient]);

  const handleSearch = () => {
    if (!searchData.lat || !searchData.lng) {
      alert("Please select a location from the dropdown.");
      return;
    }
    const params = new URLSearchParams(searchData).toString();
    navigate(`/search/map?${params}`);
  };

  return (
    <div className="hero-section container-fluid p-0">
      {/* SECCIÓN HERO (Lo que ya teníamos) */}
      <div className="row g-0 align-items-center min-vh-100">
        <div className="col-lg-6 p-5 content-side">
          <h1 className="display-4 fw-bold hero-title">
            Find the best <br />
            <span className="highlight-text">Storages close to you.</span>
          </h1>
          <p className="lead text-muted mt-3 mb-5 pe-lg-5">
            Modern facilities, maximum security, and the best prices in your city.
          </p>
          <div className="d-flex align-items-center mb-5">
            <button className="btn btn-primary-custom rounded-pill px-4 py-2 me-4">Discover now</button>
            <button className="btn btn-link text-dark text-decoration-none d-flex align-items-center fw-semibold">
              <span className="play-icon me-2">▶</span> See how it works
            </button>
          </div>
        </div>
        <div className="col-lg-6 image-side position-relative d-none d-lg-block">
          <div className="support-badge position-absolute top-0 end-0 m-5 bg-white rounded-4 shadow p-3 text-center z-3">
            <span className="d-block fw-bold fs-5 text-danger">🎧 24/7</span>
            <small className="text-muted fw-semibold">Customer Support</small>
          </div>
        </div>
      </div>

    
      <div className="search-bar-container container position-relative">
        <h6 className="fw-bold mb-3 ms-2">Search your storage</h6>
        <div className="bg-white rounded-pill shadow-lg p-3 d-flex align-items-center justify-content-between flex-wrap">
          <div className="search-field px-4 border-end flex-grow-1">
            <label className="text-muted small mb-0 d-block">Location</label>
            <input ref={inputRef} type="text" className="form-control border-0 p-0 shadow-none fw-bold" placeholder="Where do you need it?" />
          </div>
          <div className="search-field px-4 border-end flex-grow-1">
            <label className="text-muted small mb-0 d-block">From</label>
            <input type="date" className="form-control border-0 p-0 shadow-none fw-bold" onChange={(e) => setSearchData({...searchData, checkin: e.target.value})} />
          </div>
          <div className="search-field px-4 flex-grow-1">
            <label className="text-muted small mb-0 d-block">To</label>
            <input type="date" className="form-control border-0 p-0 shadow-none fw-bold" onChange={(e) => setSearchData({...searchData, checkout: e.target.value})} />
          </div>
          <button onClick={handleSearch} className="btn btn-primary-custom rounded-circle search-btn shadow-sm ms-2">
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>

      {/* FEATURED LOCATIONS SECTION (NUEVA) */}
      <div className="container py-5 mt-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6">Featured Locations</h2>
          <p className="text-muted">Explore our high-security facilities across the country</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading locations...</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {locations.map((loc, index) => (
              <div key={loc.id || index} className="col">
                <div className="location-card card h-100 shadow-sm border-0">
                  <div className="card-img-wrapper position-relative">
                     {/* Imagen real de la ciudad o placeholder de Unsplash */}
                    <img 
                      src={loc.image || `https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=500`} 
                      className="card-img-top" 
                      alt={loc.city} 
                    />
                    <div className="location-tag position-absolute top-0 start-0 m-3 badge rounded-pill bg-dark py-2 px-3">
                       <i className="fa fa-map-marker-alt me-1"></i> {loc.city}
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-2">{loc.city || 'Main Facility'}</h5>
                    <p className="text-muted small mb-4">{loc.description || 'Secure storage with 24/7 access and video surveillance.'}</p>
                    <button 
                      className="btn btn-outline-primary w-100 rounded-pill fw-bold"
                      onClick={() => navigate(`/client/private/storages/${loc.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};