import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Attendance from "./dashboard/Attendance";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC USER */}
      <Route path="/" element={<Home />} />
      <Route path="/event/:id" element={<EventDetail />} />

      {/* ADMIN */}
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/attendance"element={<Attendance/>} />
    </Routes>
  );
}