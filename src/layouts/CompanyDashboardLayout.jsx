export const CompanyDashboardLayout = () => {

  const links = [
    { to: "/company/dashboard", label: "Profile" },
    { to: "/company/dashboard/locations", label: "Locations" },
    { to: "/company/dashboard/storages", label: "Storages" },
    { to: "/company/dashboard/chat", label: "Chat" }
  ];

    return (
        <div className="d-flex">
            <DashboardSidebar
                title="Company Panel"
                links={links}
                color="#91BBF2"
            />
            <div className="flex-grow-1 p-4">
                <Outlet />
            </div>
        </div>
    );
};