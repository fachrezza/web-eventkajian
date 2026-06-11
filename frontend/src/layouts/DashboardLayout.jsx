import { useState } from "react";
import { Home, BarChart3, Ticket, LogOut } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [active, setActive] = useState("dashboard");

  const menu = [
    { name: "Dashboard", icon: <Home />, key: "dashboard" },
    { name: "Tickets", icon: <Ticket />, key: "tickets" },
    { name: "Analytics", icon: <BarChart3 />, key: "analytics" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-4">
        <h1 className="text-xl font-bold mb-6">🎫 Event Admin</h1>

        <nav className="space-y-2">
          {menu.map((item) => (
            <div
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                active === item.key ? "bg-indigo-100 text-indigo-600" : ""
              }`}
            >
              {item.icon}
              {item.name}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-5">
          <div className="flex items-center gap-2 text-red-500 cursor-pointer">
            <LogOut size={18} />
            Logout
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}