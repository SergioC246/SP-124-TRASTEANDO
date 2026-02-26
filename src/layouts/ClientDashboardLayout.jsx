import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardSidebar } from "../front/components/DashboardSidebar";

export const ClientDashboardLayout = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);

  const links = [
    { to: "/client/dashboard/profile", label: "My Profile", icon: "bi-person" },
    { to: "/client/dashboard/search", label: "Search", icon: "bi-search" },
    { to: "/client/dashboard/leases", label: "My Leases", icon: "bi-box-seam" },
    { to: "/client/dashboard/inventory", label: "My Inventory", icon: "bi-archive" },
    { to: "/client/dashboard/storages", label: "Storages available", icon: "bi-box" },
    { to: "/client/dashboard/locations", label: "Locations available", icon: "bi-building" },
    { to: "/client/dashboard/chat", label: "Chat", icon: "bi-chat-dots" },
  ];

  useEffect(() => {
    const loadMe = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("tokenClient");

        if (!token) {
          navigate("/client/login");
          return;
        }

        const resp = await fetch(`${backendUrl}/api/private/client`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resp.ok) return;

        const data = await resp.json();
        setMe(data);
      } catch (e) {
        console.error("Error loading client profile:", e);
      }
    };

    loadMe();
  }, [navigate]);

  const user = {
    name: me?.email?.split("@")[0] || "Client",
    email: me?.email || "",
    photo: me?.photo_url || null,
    editPath: me?.id ? `/clients/${me.id}/edit` : null,
  };

  const onLogout = () => {
    localStorage.removeItem("tokenClient"); // 🔥 corregido
    navigate("/client/login");
  };

  return (
    <div
      className="d-flex justify-content-center"
      style={{
        minHeight: "100vh",
        background: "#0b0f17",   // fondo global
        padding: 40,
      }}
    >
      <div
        className="d-flex"
        style={{
          width: "1200px",
          borderRadius: 28,
          overflow: "hidden",
          background: "#111827", // card principal
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <DashboardSidebar
          title="Client"
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