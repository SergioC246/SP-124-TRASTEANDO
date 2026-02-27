import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardSidebar } from "../front/components/DashboardSidebar";

export const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);

  const links = [
    { to: "/admin/dashboard/private", label: "Profile", icon: "bi-person-gear" },
    { to: "/admin/dashboard/users", label: "Admin Users", icon: "bi-people" },
    { to: "/admin/dashboard/companies", label: "Companies", icon: "bi-buildings" },
    { to: "/admin/dashboard/clients", label: "Clients", icon: "bi-person-lines-fill" },
  ];

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("admin_token");

        if (!token) {
          navigate("/admin/login");
          return;
        }

        const resp = await fetch(`${backendUrl}/api/private/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resp.ok) return;

        const data = await resp.json();
        setMe(data);
      } catch (err) {
        console.error("Error loading admin:", err);
      }
    };

    loadAdmin();
  }, [navigate]);

  const user = {
    name: me?.email?.split("@")[0] || "Admin",
    email: me?.email || "",
    photo: me?.photo_url || null,
    editPath: null, // normalmente admin no edita perfil aquí
  };

  const onLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div
      className="d-flex justify-content-center"
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: 40,
      }}
    >
      <div
        className="d-flex"
        style={{
          width: "1200px",
          borderRadius: 28,
          overflow: "hidden",
          background: "#f9fafb",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <DashboardSidebar
          title="Admin Panel"
          links={links}
          color="#5C73F2"
          user={user}
          onLogout={onLogout}
        />

        <div
          className="flex-grow-1 p-4"
          style={{ color: "#e9eefc" }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};