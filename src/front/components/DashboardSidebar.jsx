import { NavLink, useNavigate } from "react-router-dom";

export const DashboardSidebar = ({ title, links, color, user, onLogout }) => {
  const navigate = useNavigate();

  const fallbackAvatar =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>
        <rect width='100%' height='100%' fill='${color}'/>
        <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle'
          font-family='Arial' font-size='18' fill='white'>U</text>
      </svg>
    `);

  const avatar = user?.photo || fallbackAvatar;

  return (
    <div style={{ width: 300, padding: 16 }}>
      <div
        style={{
          background: "#111827",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.08)",
          padding: 20,
        }}
      >
        {/* PERFIL */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <img
              src={avatar}
              alt="avatar"
              className="rounded-circle"
              style={{
                width: 72,
                height: 72,
                objectFit: "cover",
                aspectRatio: "1 / 1",
                border: `2px solid ${color}`,
              }}
            />
            <div style={{ color: "#e9eefc" }}>
              <div className="fw-bold">{user?.name || title}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>
                {user?.email || ""}
              </div>
            </div>
          </div>

          {user?.editPath && (
            <button
              className="btn btn-sm"
              onClick={() => navigate(user.editPath)}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <i className="bi bi-pencil"></i>
            </button>
          )}
        </div>

        {/* LINKS */}
        <ul className="nav flex-column">
          {links.map((link, index) => (
            <li key={index} className="nav-item mb-2">
              <NavLink
                to={link.to}
                end={link.to.endsWith("/dashboard")}
                className="nav-link d-flex align-items-center"
                style={({ isActive }) => ({
                  color: "#fff",
                  borderRadius: 14,
                  padding: "10px 12px",
                  background: isActive ? color : "transparent",
                  transition: "all 0.2s ease",
                })}
              >
                {link.icon && (
                  <i className={`bi ${link.icon} me-2`}></i>
                )}
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* LOGOUT */}
        <div className="mt-4">
          <button
            className="btn w-100"
            onClick={onLogout}
            style={{
              background: color,
              color: "white",
              borderRadius: 14,
              border: "none",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};