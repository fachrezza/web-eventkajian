import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-pink-100">

      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-lg tracking-wide text-gray-800"
        >

          <span className="bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent font-black">
            Hilyatul Muslimah
          </span>
        </Link>

        {/* MENU */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">

          <Link
            to="/"
            className="relative group hover:text-gray-900 transition"
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-400 group-hover:w-full transition-all"></span>
          </Link>

          <a
            href="#ticket"
            className="relative group hover:text-gray-900 transition"
          >
            Tiket
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-400 group-hover:w-full transition-all"></span>
          </a>

          <a
            href="#lokasi"
            className="relative group hover:text-gray-900 transition"
          >
            Lokasi
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-400 group-hover:w-full transition-all"></span>
          </a>

        </div>

        {/* CTA BUTTON */}
        {/* <Link
          to="/login"
          className="px-5 py-2 rounded-full text-sm font-medium
          bg-gray-900 text-white hover:bg-gray-800
          shadow-sm transition"
        >
          Admin Login
        </Link> */}

      </div>
    </nav>
  );
}