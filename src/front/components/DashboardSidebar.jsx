import { NavLink } from "react-router-dom";

export const DashboardSidebar = ({ title, links, color }) => {

  return (
    <div
      className="d-flex flex-column p-3 shadow"
      style={{
        width: "260px",
        minHeight: "100vh",
        backgroundColor: color,
      }}
    >
      {/* Título */}
      <div className="mb-4 text-white">
        <h4 className="fw-bold">{title}</h4>
        <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />
      </div>

      {/* Links */}
      <ul className="nav nav-pills flex-column mb-auto">

        {links.map((link, index) => (
          <li key={index} className="nav-item mb-2">
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                "nav-link text-white " +
                (isActive ? "active" : "")
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                borderRadius: "8px",
              })}
            >
              {link.label}
            </NavLink>
          </li>
        ))}

      </ul>

      {/* Logout abajo */}
      <div className="mt-auto">
        <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />
        <button className="btn btn-light w-100">
          Logout
        </button>
      </div>

    </div>
  );
};