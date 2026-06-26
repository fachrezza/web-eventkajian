import { Link } from "react-router-dom";

export default function NavbarCS() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">

        <div>
          <h1 className="font-black text-2xl text-gray-900">
            HilyatulMuslimah
          </h1>
        </div>

        <div className="hidden md:flex gap-10 text-gray-600">
          <Link to="/">Home</Link>
          <Link to="/">Tentang</Link>
          <Link to="/">Pemateri</Link>
          <Link to="/">Kontak</Link>
        </div>

        <button className=" px-6 py-3 rounded-xl">
          
        </button>
      </div>
    </nav>
  );
}