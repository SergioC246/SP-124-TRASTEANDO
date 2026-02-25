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

    if (window.google?.maps?.places) {
      initAutocomplete();
    } else {
      const existingScript = document.getElementById("google-maps-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => initAutocomplete();
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener("load", initAutocomplete);
      }
    }
  }, []);

  // Ubicacaiones
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
    <div className="hero-section container-fluid">
      <div className="row g-0 align-items-center min-vh-100">
        <div className="col-lg-6 p-5 content-side">
          <h1 className="display-4 fw-bold hero-title" style={{ fontSize: '3.5rem' }}>
            Find the best <br />
            <span className="highlight-container">
              <span className="highlight-text">Storages close to you.</span>
              <svg className="underline-svg" width="390.5px" height="21.5px" viewBox="0 0 445.5 21.5">
                <path d="M409.9,2.6c-9.7-0.6-19.5-1-29.2-1.5c-3.2-0.2-6.4-0.2-9.7-0.3c-7-0.2-14-0.4-20.9-0.5 c-3.9-0.1-7.8-0.2-11.7-0.3c-1.1,0-2.3,0-3.4,0c-2.5,0-5.1,0-7.6,0c-11.5,0-23,0-34.5,0c-2.7,0-5.5,0.1-8.2,0.1 c-6.8,0.1-13.6,0.2-20.3,0.3c-7.7,0.1-15.3,0.1-23,0.3c-12.4,0.3-24.8,0.6-37.1,0.9c-7.2,0.2-14.3,0.3-21.5,0.6 c-12.3,0.5-24.7,1-37,1.5c-6.7,0.3-13.5,0.5-20.2,0.9C112.7,5.3,99.9,6,87.1,6.7C80.3,7.1,73.5,7.4,66.7,8 C54,9.1,41.3,10.1,28.5,11.2c-2.7,0.2-5.5,0.5-8.2,0.7c-5.5,0.5-11,1.2-16.4,1.8c-0.3,0-0.7,0.1-1,0.1c-0.7,0.2-1.2,0.5-1.7,1 C0.4,15.6,0,16.6,0,17.6c0,1,0.4,2,1.1,2.7c0.7,0.7,1.8,1.2,2.7,1.1c6.6-0.7,13.2-1.5,19.8-2.1c6.1-0.5,12.3-1,18.4-1.6 c6.7-0.6,13.4-1.1,20.1-1.7c2.7-0.2,5.4-0.5,8.1-0.7c10.4-0.6,20.9-1.1,31.3-1.7c6.5-0.4,13-0.7,19.5-1.1c2.7-0.1,5.4-0.3,8.1-0.4 c10.3-0.4,20.7-0.8,31-1.2c6.3-0.2,12.5-0.5,18.8-0.7c2.1-0.1,4.2-0.2,6.3-0.2c11.2-0.3,22.3-0.5,33.5-0.8 c6.2-0.1,12.5-0.3,18.7-0.4c2.2-0.1,4.4-0.1,6.7-0.1c11.5-0.1,23-0.2,34.6-0.4c7.2-0.1,14.4-0.1,21.6-0.1c12.2,0,24.5,0.1,36.7,0.1 c2.4,0,4.8,0.1,7.2,0.2c6.8,0.2,13.5,0.4,20.3,0.6c5.1,0.2,10.1,0.3,15.2,0.4c3.6,0.1,7.2,0.4,10.8,0.6c10.6,0.6,21.1,1.2,31.7,1.8 c2.7,0.2,5.4,0.4,8,0.6c2.9,0.2,5.8,0.4,8.6,0.7c0.4,0.1,0.9,0.2,1.3,0.3c1.1,0.2,2.2,0.2,3.2-0.4c0.9-0.5,1.6-1.5,1.9-2.5 c0.6-2.2-0.7-4.5-2.9-5.2c-1.9-0.5-3.9-0.7-5.9-0.9c-1.4-0.1-2.7-0.3-4.1-0.4c-2.6-0.3-5.2-0.4-7.9-0.6 C419.7,3.1,414.8,2.9,409.9,2.6z"></path>
              </svg>
            </span>
          </h1>
          <p className="lead text-muted mt-3 mb-5 pe-lg-5">
            Modern facilities, maximum security, and the best prices in your city.
          </p>
          <div className="d-flex align-items-center mb-5">
            <button className="btn btn-primary-custom rounded-pill px-5 py-3 me-4 shadow-sm">
              Discover now
            </button>
          </div>
        </div>

        {/* customer support */}
        <div className="col-lg-6 image-side position-relative d-none d-lg-block">
          <div className="support-badge position-absolute shadow-lg text-center z-3">
            <span className="d-block fw-bold fs-5 text-danger">🎧 24/7</span>
            <small className="text-muted fw-bold">Customer Support</small>
          </div>
        </div>
      </div>

      {/*barra de busqeuda */}
      <div className="search-bar-container mx-auto position-relative">
        <h6 className="fw-bold mb-3 ms-4 text-dark">Search your storage</h6>
        <div className="bg-white search-bar-inner shadow-lg d-flex align-items-center justify-content-between">
          <div className="search-field border-end flex-grow-1">
            <label className="d-block mb-0">Location</label>
            <input ref={inputRef} type="text" className="form-control border-0 p-0 shadow-none fw-bold" placeholder="Where do you need it?" />
          </div>
          <div className="search-field border-end flex-grow-1">
            <label className="d-block mb-0">From</label>
            <input type="date" className="form-control border-0 p-0 shadow-none fw-bold" onChange={(e) => setSearchData({ ...searchData, checkin: e.target.value })} />
          </div>
          <div className="search-field flex-grow-1">
            <label className="d-block mb-0">To</label>
            <input type="date" className="form-control border-0 p-0 shadow-none fw-bold" onChange={(e) => setSearchData({ ...searchData, checkout: e.target.value })} />
          </div>
          <button onClick={handleSearch} className="btn search-btn text-white ms-2">
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>

      <div className="container py-5 mt-5">
        <div className="text-center mb-5 mt-5">
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