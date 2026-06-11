import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex justify-between p-4 shadow bg-white">
      <Link to="/" className="font-bold">
        🎫 EventApp
      </Link>

      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/login">Admin</Link>
      </div>
    </div>
  );
}