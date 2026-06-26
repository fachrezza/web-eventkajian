import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "",
    },
    {
      name: "Ticket Management",
      path: "/admin/tickets",
      icon: "",
    },
    {
      name: "Attendance",
      path: "/admin/attendance",
      icon: "",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "",
    },
  ];

  return (
    <div className={`h-screen fixed left-0 top-0 w-72 bg-white shadow`}>
      <div className="p-3 space-y-2">
        {menu.map((item) => {
          const active = location.pathname + location.search === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex gap-3 p-3 rounded-xl ${
                active ? "bg-pink-500 text-white" : "hover:bg-pink-50"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}