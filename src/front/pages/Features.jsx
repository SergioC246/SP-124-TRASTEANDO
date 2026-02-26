import { useEffect } from "react"

export const Features = () => {

    useEffect(() => {
        const sections = document.querySelectorAll(".fade-section");

        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return (
       <div className="container-fluid p-0 features-bg">
      {/* ================= HERO ================= */}
      <div
        className="container text-center text-white py-5 fade-section hero"
        style={{ paddingTop: "120px", paddingBottom: "120px" }}
      >
        <h1 className="display-2 fw-bold hero-title">
          Building Trasteando
        </h1>
        <p className="lead mx-auto" style={{ maxWidth: "900px" }}>
          A full-stack marketplace engineered with scalable architecture,
          secure authentication, real-time systems, and AI-driven features.
        </p>
        <div className="tech-stack">
          <span><i className="fa-brands fa-react me-1"></i> React</span>
          <span>🐍 Flask</span>
          <span>🗄 SQLAlchemy</span>
          <span>🔐 JWT</span>
          <span>💳 Stripe</span>
          <span>⚡ Socket.IO</span>
          <span> 📍 Google Maps</span>
        </div>
      </div>

      <div className="section-divider fade-section"></div>

      {/* ================= MARKETPLACE ARCHITECTURE ================= */}
      <div className="container py-5 text-white fade-section">
        <h2 className="section-title text-center mb-3">Marketplace Architecture</h2>
        <p className="text-center mb-5">
          Dual-role platform with role-based dashboards, protected routes, and clear separation of client and company functionalities.
        </p>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">Client Application Layer</h5>
              <ul>
                <li>Location search with interactive maps</li>
                <li>Filter and compare available storage units</li>
                <li>Secure booking flow and payment integration</li>
                <li>Personalized dashboard with user metrics</li>
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">Company Management Layer</h5>
              <ul>
                <li>CRUD for storage facilities and availability</li>
                <li>Real-time communication with clients</li>
                <li>Revenue tracking and analytics</li>
                <li>Role-based access control for staff</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider fade-section"></div>

      {/* ================= BACKEND ================= */}
      <div className="container py-5 text-white fade-section">
        <h2 className="section-title text-center mb-3">Backend Engineering</h2>
        <p className="text-center mb-5">
          RESTful API architecture built with Flask, designed for maintainability and scalability.
        </p>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">API Architecture</h5>
              <ul>
                <li>RESTful endpoints structured by resource</li>
                <li>HTTP methods: GET, POST, PUT, DELETE</li>
                <li>Modular blueprint separation</li>
                <li>Controller-service pattern for maintainability</li>
              </ul>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">Database Design</h5>
              <ul>
                <li>Relational modeling with SQLAlchemy ORM</li>
                <li>One-to-many and many-to-many relationships</li>
                <li>Optimized queries and indexing</li>
                <li>Migration-ready structure</li>
              </ul>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">Authentication & Security</h5>
              <ul>
                <li>JWT-based authentication</li>
                <li>Role-based access control (RBAC)</li>
                <li>Protected routes and middleware validation</li>
                <li>Secure password hashing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider fade-section"></div>

      {/* ================= FRONTEND ================= */}
      <div className="container py-5 text-white fade-section">
        <h2 className="section-title text-center mb-3">Frontend Architecture</h2>
        <p className="text-center mb-5">
          Component-driven architecture using React for scalability and maintainability.
        </p>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">Component System</h5>
              <ul>
                <li>40+ reusable components</li>
                <li>Layout abstraction for scalability</li>
                <li>Separation of UI and logic layers</li>
                <li>State-driven rendering</li>
              </ul>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">Routing & Access Control</h5>
              <ul>
                <li>React Router protected routes</li>
                <li>Role-based client-side authorization</li>
                <li>Private and public route separation</li>
              </ul>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">UX & Performance</h5>
              <ul>
                <li>Responsive design with Bootstrap</li>
                <li>Optimized rendering patterns</li>
                <li>Clean state management</li>
                <li>Smooth UI transitions & animations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider fade-section"></div>

      {/* ================= ADVANCED FUNCTIONALITIES ================= */}
      <div className="container py-5 text-white fade-section">
        <h2 className="section-title text-center mb-5">Advanced Functionalities</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">⚡ Real-Time Communication — Socket.IO</h5>
              <p>WebSocket-based messaging enabling instant communication between clients and storage providers.</p>
              <ul>
                <li>Event-driven architecture</li>
                <li>Persistent socket sessions</li>
                <li>Dynamic UI updates without page refresh</li>
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">💳 Secure Payments — Stripe</h5>
              <p>Tokenized, secure transactions with webhook validation.</p>
              <ul>
                <li>Checkout session handling</li>
                <li>Backend verification</li>
                <li>Payment status validation</li>
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">🤖 AI-Powered Inventory — Inventariator</h5>
              <p>AI-based module for intelligent product classification and automated categorization.</p>
              <ul>
                <li>Automated categorization</li>
                <li>Structured data tagging</li>
                <li>Scalable module integration</li>
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">🗺 Location Intelligence — Google Maps</h5>
              <p>Interactive maps to visualize storage locations and identify nearest facilities.</p>
              <ul>
                <li>Dynamic map rendering</li>
                <li>Nearby storage highlighting</li>
                <li>User-friendly map controls</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider fade-section"></div>

      {/* ================= SECURITY & SCALABILITY ================= */}
      <div className="container py-5 text-white text-center fade-section">
        <h2 className="section-title mb-4">Security, Scalability & Vision</h2>
        <p className="mx-auto" style={{ maxWidth: "900px" }}>
          Trasteando was designed with scalability and maintainability in mind.
          Its modular backend structure, secure authentication flow,
          and reusable frontend architecture allow for future growth
          and feature expansion. This project represents our transition
          from students to engineers — building with structure,
          intention, and long-term product vision.
        </p>
      </div>
    </div>
  );
};