import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../components/DashboardSidebar";

export const ClientDashboardLayout = () => {

    const links = [
        { to: "/client/dashboard", label: "Profile" },
        { to: "/client/dashboard/leases", label: "My Leases" },
        { to: "/client/dashboard/search", label: "Search Storages" },
        { to: "/client/dashboard/inventory", label: "Inventory" },
        { to: "/client/dashboard/chat", label: "Chat" }
    ];

    return (
        <div className="d-flex">
            <DashboardSidebar
                title="Client Panel"
                links={links}
                color="#5C73F2"
            />
            <div className="flex-grow-1 p-4">
                <Outlet />
            </div>
        </div>
    );
};