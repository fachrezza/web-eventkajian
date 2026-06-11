import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import Navbar from "../components/Navbar";

export default function Home() {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
  const res = await axios.get("http://localhost:8000/api/events");

  console.log(res.data); // DEBUG WAJIB

  setEvents(res.data.data ?? res.data ?? []);
};

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          🎫 Event Tersedia
        </h1>

        <div className="grid grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}