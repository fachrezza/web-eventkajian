import { useState } from "react";
import axios from "axios";

export default function Checkout({ event }) {
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    quantity: 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkout = async () => {
    const res = await axios.post("http://localhost:8000/api/checkout", {
      event_id: event.id,
      ticket_type_id: event.ticket_type_id, // atau dari UI
      ...form,
    });

    const snapToken = res.data.snap_token;

    // 🔥 INI TEMPAT window.snap.pay
    window.snap.pay(snapToken, {
      onSuccess: function (result) {
        console.log("SUCCESS", result);
        alert("Pembayaran sukses");
      },
      onPending: function (result) {
        console.log("PENDING", result);
      },
      onError: function (result) {
        console.log("ERROR", result);
      },
    });
  };

  return (
    <div className="p-6">
      <h2>Checkout Tiket</h2>

      <input
        name="customer_name"
        placeholder="Nama"
        onChange={handleChange}
      />

      <input
        name="customer_email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        name="customer_phone"
        placeholder="Phone"
        onChange={handleChange}
      />

      <input
        type="number"
        name="quantity"
        min="1"
        onChange={handleChange}
      />

      <button onClick={checkout}>
        Bayar Sekarang
      </button>
    </div>
  );
}