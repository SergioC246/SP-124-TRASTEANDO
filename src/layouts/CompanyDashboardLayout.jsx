import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardSidebar } from "../front/components/DashboardSidebar";

export const CompanyDashboardLayout = () => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);

  const links = [
    { to: "/company/dashboard", label: "Profile", icon: "bi-building" },
    // { to: "/company/dashboard/locations", label: "Locations", icon: "bi-geo-alt" },
    // { to: "/company/dashboard/storages", label: "Storages", icon: "bi-box" },
    { to: "/company/dashboard/chat", label: "Chat", icon: "bi-chat-dots" },
  ];

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token_company");

        if (!token) {
          navigate("/companies/login");
          return;
        }

        const resp = await fetch(`${backendUrl}/api/private/company`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resp.ok) return;

        const data = await resp.json();
        setMe(data);
      } catch (err) {
        console.error("Error loading company:", err);
      }
    };

    loadCompany();
  }, [navigate]);

  const user = {
    name: me?.name || me?.company_name || "Company",
    email: me?.email || "",
    photo: me?.photo_url || null,
    editPath: me?.id ? `/companies/${me.id}/edit` : null,
  };

  const onLogout = () => {
    localStorage.removeItem("token_company");
    navigate("/companies/login");
  };

  return (
    <div
      className="d-flex justify-content-center"
      style={{ minHeight: "100vh", background: "#ffffff", padding: 40 }}
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
          title="Company Panel"
          links={links}
          color="#5C73F2"
          user={user}
          onLogout={onLogout}
        />

        <div className="flex-grow-1 p-4" style={{ color: "#e9eefc" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};