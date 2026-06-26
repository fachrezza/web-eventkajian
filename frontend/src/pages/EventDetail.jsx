import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EventDetail() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);

  const [selectedTicket, setSelectedTicket] = useState(null);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    quantity: 1,
  });

  // ================= FETCH EVENT =================
  const fetchEvent = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/events/${id}`
      );

      setEvent(res.data);
      console.log(res.data);

      // auto pilih ticket pertama
      if (res.data.ticket_types?.length > 0) {
        setSelectedTicket(res.data.ticket_types[0]);
      }

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= TOTAL =================
  const total =
    selectedTicket
      ? selectedTicket.price * form.quantity
      : 0;

  // ================= CHECKOUT =================
  const checkout = async () => {
    try {

      if (!selectedTicket) {
        alert("Pilih ticket dulu");
        return;
      }

      const res = await axios.post(
        "http://localhost:8000/api/checkout",
        {
          event_id: id,
          ticket_type_id: selectedTicket.id,
          ...form,
        }
      );

      const snapToken = res.data.snap_token;

      window.snap.pay(snapToken, {

        onSuccess: function (result) {
          console.log(result);
          alert("Pembayaran berhasil");
        },

        onPending: function (result) {
          console.log(result);
          alert("Menunggu pembayaran");
        },

        onError: function (result) {
          console.log(result);
          alert("Pembayaran gagal");
        },

      });

    } catch (err) {
      console.log(err);
      alert("Checkout gagal");
    }
  };

  if (!event) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO */}
      <div className="bg-black text-white py-16 px-6">

        <div className="max-w-5xl mx-auto">

          <h1 className="text-4xl font-bold">
            {event.title}
          </h1>

          <p className="mt-4 text-gray-300">
            {event.description}
          </p>

        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 p-6">

        {/* LEFT */}
        <div>

          <h2 className="text-2xl font-bold mb-4">
            Pilih Ticket
          </h2>

          <div className="space-y-4">

            {event.ticket_types?.map((ticket) => (

              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`border rounded-2xl p-5 cursor-pointer transition
                  
                  ${
                    selectedTicket?.id === ticket.id
                      ? "border-green-500 bg-green-50"
                      : "bg-white"
                  }
                  
                `}
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h3 className="text-xl font-bold">
                      {ticket.name}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      {ticket.description}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-2xl font-bold">
                      Rp{" "}
                      {Number(ticket.price).toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-500">
                      Sisa {ticket.quota - ticket.sold}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit">

          <h2 className="text-2xl font-bold mb-6">
            Checkout
          </h2>

          <div className="space-y-4">

            <input
              name="customer_name"
              placeholder="Nama Lengkap"
              className="w-full border p-3 rounded-xl"
              onChange={handleChange}
            />

            <input
              name="customer_email"
              placeholder="Email"
              className="w-full border p-3 rounded-xl"
              onChange={handleChange}
            />

            <input
              name="customer_phone"
              placeholder="Nomor HP"
              className="w-full border p-3 rounded-xl"
              onChange={handleChange}
            />

            <input
              type="number"
              name="quantity"
              min="1"
              className="w-full border p-3 rounded-xl"
              value={form.quantity}
              onChange={handleChange}
            />

          </div>

          {/* SUMMARY */}
          <div className="mt-6 border-t pt-4 space-y-2">

            <div className="flex justify-between">
              <span>Ticket</span>

              <span>
                {selectedTicket?.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Quantity</span>

              <span>{form.quantity}</span>
            </div>

            <div className="flex justify-between font-bold text-xl">

              <span>Total</span>

              <span>
                Rp {Number(total).toLocaleString()}
              </span>

            </div>

          </div>

          <button
            onClick={checkout}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl mt-6 font-semibold"
          >
            Bayar Sekarang
          </button>

        </div>

      </div>

    </div>
  );
}