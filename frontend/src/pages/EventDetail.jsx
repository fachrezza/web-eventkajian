import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    quantity: 1,
  });

  const fetchEvent = async () => {
    const res = await axios.get(`http://localhost:8000/api/events/${id}`);
    setEvent(res.data);
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const checkout = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/checkout", {
        event_id: id,
        ticket_type_id: event.ticket_type_id ?? 1, // fallback kalau belum ada UI type
        ...form,
      });

      const snapToken = res.data.snap_token;

      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          console.log("SUCCESS", result);
          alert("Pembayaran berhasil!");
        },
        onPending: function (result) {
          console.log("PENDING", result);
        },
        onError: function (result) {
          console.log("ERROR", result);
        },
      });
    } catch (err) {
      console.log(err);
      alert("Checkout gagal");
    }
  };

  if (!event) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* EVENT INFO */}
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="mt-2 text-gray-600">{event.description}</p>

      <p className="mt-2 font-semibold">💰 Harga: 50000</p>

      {/* FORM CHECKOUT */}
      <div className="mt-6 space-y-3">
        <input
          name="customer_name"
          placeholder="Nama"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="customer_email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="customer_phone"
          placeholder="No HP"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="number"
          name="quantity"
          min="1"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <button
          onClick={checkout}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}