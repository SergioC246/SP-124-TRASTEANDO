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
      <div className="container text-center text-white py-5 fade-section hero">
        <h1 className="display-2 fw-bold hero-title">
          Building Trasteando
        </h1>
        <p className="lead mx-auto hero-subtitle">
          A full-stack storage marketplace engineered with scalable architecture,
          secure authentication, real-time systems and geolocation intelligence.
        </p>
      </div>

      <div className="section-divider fade-section"></div>

      {/* ================= WHAT IS TRASTEANDO ================= */}
      <div className="container py-5 text-white text-center fade-section">
        <h2 className="section-title mb-4">What is Trasteando?</h2>
        <p className="mx-auto section-text">
          Trasteando is a two-sided storage marketplace that connects individuals
          looking for storage space with companies offering available units.
          Users can search, compare, book and manage storage facilities in real time,
          while businesses control availability, revenue, and communication
          through a dedicated management dashboard.
        </p>
      </div>

      <div className="section-divider fade-section"></div>

      {/* ================= TECHNOLOGIES ================= */}
      <div className="container py-5 text-white text-center fade-section">
        <h2 className="section-title mb-3">Technologies & Tools Implemented</h2>
        <p className="mx-auto mb-4 section-text">
          To bring this platform to life, we implemented a modern full-stack architecture
          combining frontend, backend, database modeling, authentication systems,
          payment processing, real-time communication and interactive mapping.
        </p>

        <div className="tech-stack">
          <span><i className="fa-brands fa-react me-1"></i> React</span>
          <span>🐍 Flask</span>
          <span>🗄 SQLAlchemy</span>
          <span>🔐 JWT</span>
          <span>💳 Stripe</span>
          <span>⚡ Socket.IO</span>
          <span>📍 Google Maps</span>
          <span>🤖 OpenAI</span>
        </div>
      </div>

      <div className="section-divider fade-section"></div>

      {/* ================= MARKETPLACE ARCHITECTURE ================= */}
      <div className="container py-5 text-white fade-section">
        <h2 className="section-title text-center mb-5">Marketplace Architecture</h2>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">Client Application Layer</h5>
              <ul>
                <li>Location-based search with interactive maps</li>
                <li>Storage comparison and filtering system</li>
                <li>Secure booking and payment flow</li>
                <li>Personal dashboard with user metrics</li>
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">Company Management Layer</h5>
              <ul>
                <li>CRUD system for storage facilities</li>
                <li>Availability and pricing management</li>
                <li>Revenue tracking dashboard</li>
                <li>Role-based staff access control</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section-divider fade-section"></div>

      {/* ================= BACKEND ENGINEERING ================= */}
<div className="container py-5 text-white fade-section">
  <h2 className="section-title text-center mb-3">Backend Engineering</h2>
  <p className="text-center mb-5">
    RESTful API architecture built with Flask, designed for maintainability,
    modularity and scalability.
  </p>

  <div className="row g-4">

    <div className="col-md-4">
      <div className="feature-card p-4 h-100">
        <h5 className="fw-bold">API Architecture</h5>
        <ul>
          <li>RESTful endpoints structured by resource</li>
          <li>HTTP methods: GET, POST, PUT, DELETE</li>
          <li>Blueprint modularization</li>
          <li>Controller-service separation pattern</li>
        </ul>
      </div>
    </div>

    <div className="col-md-4">
      <div className="feature-card p-4 h-100">
        <h5 className="fw-bold">Database Design</h5>
        <ul>
          <li>Relational modeling with SQLAlchemy ORM</li>
          <li>One-to-many & many-to-many relationships</li>
          <li>Optimized queries & indexing</li>
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
          <li>Protected routes & middleware validation</li>
          <li>Secure password hashing</li>
        </ul>
      </div>
    </div>

  </div>
</div>

{/* ================= FRONTEND ARCHITECTURE ================= */}
<div className="container py-5 text-white fade-section">
  <h2 className="section-title text-center mb-3">Frontend Architecture</h2>
  <p className="text-center mb-5">
    Component-driven architecture using React, focused on scalability,
    maintainability and clean state management.
  </p>

  <div className="row g-4">

    <div className="col-md-4">
      <div className="feature-card p-4 h-100">
        <h5 className="fw-bold">Component System</h5>
        <ul>
          <li>40+ reusable components</li>
          <li>Layout abstraction</li>
          <li>Separation of UI and logic</li>
          <li>State-driven rendering</li>
        </ul>
      </div>
    </div>

    <div className="col-md-4">
      <div className="feature-card p-4 h-100">
        <h5 className="fw-bold">Routing & Access Control</h5>
        <ul>
          <li>React Router protected routes</li>
          <li>Client-side role validation</li>
          <li>Private & public route separation</li>
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
          <li>Smooth UI animations</li>
        </ul>
      </div>
    </div>

  </div>
</div>

      {/* ================= ADVANCED FUNCTIONALITIES ================= */}
      <div className="container py-5 text-white fade-section">
        <h2 className="section-title text-center mb-5">Advanced Functionalities</h2>

        <div className="row g-4">

          <div className="col-md-6">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">⚡ Real-Time Communication — Socket.IO</h5>
              <p>
                WebSocket-based messaging system enabling instant communication
                between clients and storage providers.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">💳 Secure Payments — Stripe</h5>
              <p>
                Tokenized checkout sessions with backend verification and
                payment status validation using webhooks.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">🤖 AI-Powered Inventory Module</h5>
              <p>
                Intelligent classification system for structured product tagging
                and automated categorization.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="feature-card p-4 h-100">
              <h5 className="fw-bold">🗺 Location Intelligence — Google Maps</h5>
              <p>
                Dynamic map rendering to visualize storage facilities,
                highlight nearby options and enhance user decision-making.
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="section-divider fade-section"></div>

      {/* ================= VISION ================= */}
      <div className="container py-5 text-white text-center fade-section">
        <h2 className="section-title mb-4">Security, Scalability & Vision</h2>
        <p className="mx-auto section-text">
          Trasteando was designed with scalability and maintainability in mind.
          Its modular backend structure, reusable frontend architecture and
          secure authentication flow allow future feature expansion.
          This project represents a transition from academic learning
          to production-oriented engineering thinking.
        </p>
      </div>

    </div>
  );
};