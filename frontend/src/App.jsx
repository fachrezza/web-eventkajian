import { Routes, Route } from "react-router-dom";

/* USER */
import Home from "./pages/Home";

/* AUTH */
import Login from "./pages/Login";

/* ADMIN */
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

import DashboardHome from "./dashboard/DashboardHome";
import Attendance from "./dashboard/Attendance";
import Orders from "./dashboard/Orders";
import TicketManagement from "./dashboard/TicketManagement"
import ComingSoon from "./pages/ComingSoon";

export default function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/comingsoon" element={<ComingSoon/>} />

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <DashboardHome />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Orders />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Attendance />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/tickets"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <TicketManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}