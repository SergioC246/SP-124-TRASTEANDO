import { Link } from "react-router-dom";
import logo from "../assets/img/logo-trasteando.png";

export const Footer = () => {
  return (
    <footer className="bg-black text-white pt-4">

      <div className="container">
        {/* 🔹 Top row: Logo + 4 columns */}
        <div className="row align-items-center">

          {/* Logo + Slogan */}
          <div className="col-lg-3">
            <Link to="/" className="d-flex align-items-center text-decoration-none text-white">
              <img src={logo} alt="Trasteando" height="70" className="me-2" />
              <h5 className="fw-bold fs-5" style={{ color: "#5C73F2" }}>
                Trasteando
              </h5>
            </Link>
            <p className="text-white" style={{ fontSize: "0.9rem" }}>
              Smart storage for modern living
            </p>
            <p className="mb-2 text-white">
              <i className="fa-solid fa-phone me-2"></i> +34 600 000 000
            </p>
            <Link to="/chat" className="text-white text-decoration-none">
              <i className="fas fa-comments me-2"></i>Chat
            </Link>
          </div>

          {/* Page */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Page</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/client/login" className="text-white text-decoration-none">Login Client</Link>
              </li>
              <li className="mb-2">
                <Link to="/companies/login" className="text-white text-decoration-none">Login Company</Link>
              </li>
              <li className="mb-2">
                <Link to="/client/private/locations" className="text-white text-decoration-none">Locations</Link>
              </li>
              <li>
                <Link to="/client/private/storages/:locationId" className="text-white text-decoration-none">Storages</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Legal</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none">Terms & Conditions</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none">Privacy Policy</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none">Cookies Policy</a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none">Refund Policy</a>
              </li>
            </ul>
          </div>

          {/* Payments */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Payment Methods</h5>
            <ul className="list-unstyled small text-white">
              <li className="mb-2"><i className="fa-brands fa-cc-visa me-2"></i>Visa</li>
              <li className="mb-2"><i className="fa-brands fa-cc-mastercard me-2"></i>Mastercard</li>
              <li className="mb-2"><i class="fa-brands fa-paypal me-2"></i>PayPal</li>
              <li><i className="fa-brands fa-cc-amex me-2"></i>AMEX</li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Social</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none"><i className="fa-brands fa-instagram me-2"></i>Instagram</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none"><i className="fa-brands fa-facebook me-2"></i>Facebook</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white text-decoration-none"><i className="fa-brands fa-linkedin me-2"></i>LinkedIn</a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none"><i className="fa-brands fa-twitter me-2"></i>X</a>
              </li>
            </ul>
          </div>
        </div>

        {/* 🔹 Divider */}
        <hr />

        {/* 🔹 Bottom */}
        <div className="d-lg-flex justify-content-between align-items-center py-3 text-center text-lg-start">
          <div className="text-white text-primary-hover">
            © {new Date().getFullYear()} Trasteando. All rights reserved.
          </div>

          <div className="nav mt-2 mt-lg-0 nav">
            <ul className="list-inline text-primary-hover mx-auto mb-0">
              <li className="list-inline-item me-4">                
                <a href="#" className="text-white text-decoration-none">Privacy Policy</a>
              </li>
              <li className="list-inline-item me-4">
                <a href="#" className="text-white text-decoration-none">Terms and Conditions</a>
              </li>              
              <li className="list-inline-item me-0">
                <a href="#" className="text-white text-decoration-none">Refund policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};