import { Link } from "react-router-dom";
import logo from "../assets/img/logo-trasteando.jpg"

export const Footer = () => {
	return (
		<footer
      className="mt-auto border-top"
      style={{
        backgroundColor: "#f8f9fa",
        borderColor: "#eee",
      }}
    >
      <div className="container py-4">

        {/* 🔹 Top row: Logo + 4 columns */}
        <div className="row align-items-start">

          {/* Logo + Slogan */}
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <Link to="/" className="d-flex align-items-center text-decoration-none">
              <img src={logo} alt="Trasteando" height="60" className="me-2" />
              <span className="fw-bold fs-5" style={{ color: "#5C73F2" }}>
                Trasteando
              </span>
            </Link>
            <p className="mt-1 text-muted" style={{ fontSize: "0.9rem" }}>
              Haz espacio para vivir.
            </p>
            <p className="mb-2 text-muted">
              <i className="fa-solid fa-phone me-2"></i> +34 600 000 000
            </p>
            <Link to="/chat" className="text-muted text-decoration-none">
              <i className="fas fa-comments me-2"></i>Chat
            </Link>
          </div>

          {/* Page */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">Page</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/client/login" className="text-muted text-decoration-none">Login Client</Link>
              </li>
              <li className="mb-2">
                <Link to="/companies/login" className="text-muted text-decoration-none">Login Company</Link>
              </li>
              <li className="mb-2">
                <Link to="/client/private/locations" className="text-muted text-decoration-none">Locations</Link>
              </li>
              <li>
                <Link to="/client/private/storages/:locationId" className="text-muted text-decoration-none">Storages</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">Legal</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">Terms & Conditions</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">Privacy Policy</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">Cookies Policy</a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none">Refund Policy</a>
              </li>
            </ul>
          </div>

          {/* Payments */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">Payment Methods</h6>
            <ul className="list-unstyled small text-muted">
              <li className="mb-2"><i className="fa-brands fa-cc-visa me-2"></i>Visa</li>
              <li className="mb-2"><i className="fa-brands fa-cc-mastercard me-2"></i>Mastercard</li>
              <li className="mb-2"><i class="fa-brands fa-paypal me-2"></i>PayPal</li>
              <li><i className="fa-brands fa-cc-amex me-2"></i>AMEX</li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">Social</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none"><i className="fa-brands fa-instagram me-2"></i>Instagram</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none"><i className="fa-brands fa-facebook me-2"></i>Facebook</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none"><i className="fa-brands fa-linkedin me-2"></i>LinkedIn</a>
              </li>
              <li>
                <a href="#" className="text-muted text-decoration-none"><i className="fa-brands fa-twitter me-2"></i>X</a>
              </li>
            </ul>
          </div>
        </div>

        {/* 🔹 Divider */}
        <hr />

        {/* 🔹 Bottom */}
        <div className="d-flex flex-column flex-md-row justify-content-between small text-muted">
          <div>
            © {new Date().getFullYear()} Trasteando. All rights reserved.
          </div>

          <div>
            <a href="#" className="me-3 text-muted text-decoration-none">English (US)</a>
            <a href="#" className="text-muted text-decoration-none">Spain</a>
          </div>
        </div>

      </div>
    </footer>
  );
};