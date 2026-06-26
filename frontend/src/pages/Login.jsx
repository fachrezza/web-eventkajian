import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 px-4 relative overflow-hidden">
      
      {/* Background Blur */}
      <div className="absolute w-72 h-72 bg-pink-300/30 rounded-full blur-3xl top-0 left-0"></div>
      <div className="absolute w-72 h-72 bg-rose-200/40 rounded-full blur-3xl bottom-0 right-0"></div>

      <div className="relative w-full max-w-md">
        
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg border border-pink-100 shadow-2xl rounded-3xl p-8">
          
          {/* Logo / Title */}
          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-gray-800">
              Login Admin
            </h1>

          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-2 block">
              Email
            </label>

            <input
              type="email"
              placeholder="Email Admin"
              className="w-full border border-pink-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none p-3 rounded-xl bg-pink-50/50 transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm text-gray-600 mb-2 block">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-pink-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none p-3 rounded-xl bg-pink-50/50 transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            onClick={login}
            className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-pink-200 transition duration-300"
          >
            Login Dashboard
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            © 2026 Kajian Event Management
          </p>
        </div>
      </div>
    </div>
  );
}