import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-100 shadow-md hover:shadow-xl transition rounded-2xl overflow-hidden">

      {/* HEADER STRIP */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2"></div>

      {/* CONTENT */}
      <div className="p-5">

        {/* TITLE */}
        <h2 className="text-xl font-bold text-gray-800">
          {event.title}
        </h2>

        {/* DESC */}
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
          {event.description?.slice(0, 90)}...
        </p>

        {/* INFO */}
        <div className="mt-4 space-y-1 text-sm text-gray-600">
          <p>{event.date}</p>
          <p>Tersedia tiket terbatas</p>
        </div>

        {/* PRICE (kalau ada di backend) */}
        {event.price && (
          <p className="mt-3 text-lg font-semibold text-green-600">
            Rp {Number(event.price).toLocaleString("id-ID")}
          </p>
        )}

        {/* BUTTON */}
        <button
          onClick={() => navigate(`/event/${event.id}`)}
          className="mt-5 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white py-2.5 rounded-xl font-semibold transition"
        >
          Checkout Tiket
        </button>

      </div>
    </div>
  );
}