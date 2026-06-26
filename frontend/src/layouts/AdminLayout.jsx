import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">

      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* MAIN CONTENT */}
      <main
        className={`
          min-h-screen transition-all duration-300
          ${collapsed ? "ml-20" : "ml-72"}
        `}
      >
        
        {/* TOPBAR */}
        <div className="sticky top-0 z-30 px-8 pt-6">
          <div className="bg-white/70 backdrop-blur-xl border border-pink-100 rounded-3xl px-6 py-4 shadow-lg flex items-center justify-between">

            <div>
              <p className="text-sm text-pink-500 font-medium">
                Event Kajian Islami
              </p>

              <h1 className="text-2xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white">
                👤
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Administrator
                </p>

                <p className="text-xs text-gray-500">
                  Super Admin
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-8">
          {children}
        </div>

      </main>
    </div>
  );
}