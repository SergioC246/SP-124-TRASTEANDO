export const AdminDashboardLayout = () => {

  const links = [
    { to: "/admin/dashboard", label: "Profile" },
    { to: "/admin/dashboard/users", label: "Admin Users" },
    { to: "/admin/dashboard/companies", label: "Companies" },
    { to: "/chat", label: "Chat" }
  ];

    return (
        <div className="d-flex">
            <DashboardSidebar
                title="Admin Panel"
                links={links}
                color="#F24171"
            />
            <div className="flex-grow-1 p-4">
                <Outlet />
            </div>
        </div>
    );
};