import { useEffect, useState } from "react";
import axios from "axios";

/* ================= MAIN COMPONENT ================= */
export default function TicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);

  // ================= FETCH =================
  const fetchTickets = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:8000/api/ticket-types", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ================= UPDATE =================
  const updateTicket = async (id, data) => {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:8000/api/ticket-types/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchTickets();
  };

  // ================= TOGGLE STATUS =================
  const toggleStatus = async (ticket) => {
    await updateTicket(ticket.id, {
      is_closed: !ticket.is_closed,
    });

    setSelected(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          🎟 Ticket Management
        </h1>
        <p className="text-gray-500">
          Manage price, quota, and availability
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-4">Type</th>
              <th>Price</th>
              <th>Quota</th>
              <th>Sold</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-t hover:bg-gray-50">

                {/* TYPE */}
                <td className="p-4 font-semibold">
                  {t.name}
                </td>

                {/* PRICE */}
                <td>
                  Rp {Number(t.price).toLocaleString("id-ID")}
                </td>

                {/* QUOTA */}
                <td>{t.quota}</td>

                {/* SOLD */}
                <td>{t.sold}</td>

                {/* STATUS */}
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      t.is_closed
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {t.is_closed ? "CLOSED" : "ACTIVE"}
                  </span>
                </td>

                {/* MANAGE BUTTON */}
                <td>
                  <button
                    onClick={() => setSelected(t)}
                    className="px-3 py-1 text-xs bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-lg hover:opacity-90"
                  >
                    Manage
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <Modal
          ticket={selected}
          onClose={() => setSelected(null)}
          onSave={updateTicket}
          onToggle={toggleStatus}
        />
      )}

    </div>
  );
}

/* ================= MODAL COMPONENT ================= */
function Modal({ ticket, onClose, onSave, onToggle }) {
  const [form, setForm] = useState({
    price: ticket.price,
    quota: ticket.quota,
  });

  const [loading, setLoading] = useState(false);

  // ================= SAVE HANDLER =================
  const handleSave = async () => {
    try {
      setLoading(true);

      await onSave(ticket.id, {
        price: form.price,
        quota: form.quota,
      });

      alert("✅ Data ticket berhasil diperbarui");

      onClose();
    } catch (err) {
      console.log(err);
      alert("❌ Gagal update ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[420px] rounded-2xl p-6 shadow-xl">

        {/* TITLE */}
        <h2 className="text-xl font-bold mb-5">
          Manage Ticket
        </h2>

        {/* INFO */}
        <div className="space-y-4 text-sm">

          <div>
            <p className="text-gray-500">Ticket Name</p>
            <p className="font-semibold">{ticket.name}</p>
          </div>

          {/* PRICE */}
          <div>
            <label className="text-xs text-gray-500">Price</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* QUOTA */}
          <div>
            <label className="text-xs text-gray-500">Quota</label>
            <input
              type="number"
              value={form.quota}
              onChange={(e) =>
                setForm({ ...form, quota: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-pink-300"
            />
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 mt-6">

          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 py-2 rounded-xl"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex-1 py-2 rounded-xl text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>

        </div>

        {/* TOGGLE STATUS */}
        <button
          onClick={() => onToggle(ticket)}
          disabled={loading}
          className={`w-full mt-3 py-2 rounded-xl text-white transition ${
            ticket.is_closed
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {ticket.is_closed ? "Reopen Ticket" : "Close Ticket"}
        </button>

      </div>

    </div>
  );
}