import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-xl font-bold">{event.title}</h2>

      <p className="text-gray-500 mt-2">
        {event.description?.slice(0, 80)}...
      </p>

      <p className="mt-2 text-sm">
        📅 {event.date}
      </p>

      <button
        onClick={() => navigate(`/event/${event.id}`)}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Lihat Detail
      </button>
    </div>
  );
}