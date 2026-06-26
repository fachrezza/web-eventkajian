import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  // 🔥 FILTER STATUS (NEW)
  const [statusFilter, setStatusFilter] = useState("all");
  // all | paid | pending | failed

  const perPage = 6;

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    ticket_type_id: "",
    quantity: 1,
  });

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.get(

        "http://localhost:8000/api/orders",

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      setOrders(

        Array.isArray(
          res.data.data
        )

          ? res.data.data

          : []

      );

    } catch (err) {

      console.log(err);

      setOrders([]);

    }
  };

  // ================= FETCH TICKET TYPES =================
  const fetchTicketTypes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/events");

      const allTypes = [];

      res.data.forEach((event) => {
        event.ticket_types?.forEach((type) => {
          allTypes.push(type);
        });
      });

      setTicketTypes(allTypes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchTicketTypes();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ================= FILTER =================
  const filtered =

  Array.isArray(orders)

    ? orders.filter((o) => {

        const matchSearch =
          o.customer_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchStatus =

          statusFilter === "all"
            ? true
            : o.payment_status === statusFilter;

        return (
          matchSearch &&
          matchStatus
        );
      })

    : [];

  // ================= PAGINATION =================
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  // ================= STATS =================
  const totalAttendance = orders.filter((o) =>
    o.tickets?.some((t) => t.checkin)
  ).length;

  const totalNotAttendance = orders.length - totalAttendance;

  const totalPending = orders.filter(
    (o) => o.payment_status === "pending"
  ).length;

  // ================= EXPORT =================
  const exportExcel = () => {
    const data = filtered.map((o) => ({
      Order: o.order_code,
      Customer: o.customer_name,
      Email: o.customer_email,
      Phone: o.customer_phone,
      Ticket: o.ticket_type?.name,
      Quantity: o.quantity,
      Payment: o.payment_status,
      Attendance: o.tickets?.some((t) => t.checkin)
        ? "Hadir"
        : "Belum",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");
  };

  // ================= CHECKIN =================
  const manualCheckin = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:8000/api/orders/${id}/checkin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      fetchOrders();
    } catch (err) {
      console.log(err);
      alert("Check-in gagal");
    }
  };

  // ================= HANDLE FORM =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= CREATE ORDER =================
  const createManualOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:8000/api/orders/manual",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      setShowCreate(false);
      fetchOrders();

      setForm({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        ticket_type_id: "",
        quantity: 1,
      });
    } catch (err) {
        console.log(err);

        console.log(err.response);

        console.log(err.response.data);

        alert(
          err.response?.data?.message ||
          "Gagal membuat order"
        );
      }
  };

  const downloadTicket = (order) => {
    if (
      order.payment_status !== "paid"
    ) {

      alert(
        "Tiket belum tersedia"
      );

      return;
    }
    const ticket = order?.tickets?.[0];

    if (!ticket || !ticket.qr_token) {
      alert("Ticket belum tersedia");
      return;
    }

    const url = `http://localhost:8000/api/tickets/download/${ticket.qr_token}`;

    const win = window.open(url, "_blank");

    if (!win) {
      alert("Popup diblokir browser");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow mt-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Orders & Attendance
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor pembayaran dan kehadiran
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowCreate(true)}
            className="bg-pink-500 text-white px-4 py-2 rounded-xl"
          >
            + Manual Order
          </button>

          <button
            onClick={exportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="text-2xl font-bold">{orders.length}</h2>
        </div>

        <div className="bg-green-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Sudah Hadir</p>
          <h2 className="text-2xl font-bold text-green-600">
            {totalAttendance}
          </h2>
        </div>

        <div className="bg-red-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Belum Hadir</p>
          <h2 className="text-2xl font-bold text-red-600">
            {totalNotAttendance}
          </h2>
        </div>

        {/* 🔥 NEW: BELUM BAYAR */}
        <div className="bg-yellow-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Belum Bayar</p>
          <h2 className="text-2xl font-bold text-yellow-600">
            {totalPending}
          </h2>
        </div>

      </div>

      {/* SEARCH + FILTER */}
      <input
        type="text"
        placeholder="Search customer..."
        className="border px-4 py-3 rounded-xl w-full mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 mb-4">
        {[
            "all",
            "paid",
            "pending",
            "failed",
            "expired"
          ].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-xl text-sm border ${
              statusFilter === s
                ? "bg-black text-white"
                : ""
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b text-left">
              <th className="py-3">Order</th>
              <th>Customer</th>
              <th>Ticket</th>
              <th>Qty</th>
              <th>Payment</th>
              <th>Attendance</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {paginated.map((o) => (

              <tr
                key={o.id}
                className={`border-b ${
                  o.payment_status === "pending"
                    ? "bg-yellow-50"
                    : ""
                }
                    ${
                  o.payment_status === "expired"
                    ? "bg-gray-100"
                    : ""
                }`}
              >

                <td className="py-4">{o.order_code}</td>

                <td>
                  <p className="font-semibold">
                    {o.customer_name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {o.customer_email}
                  </p>
                </td>

                <td>
                  <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-xs">
                    {o.ticket_type?.name}
                  </span>
                </td>

                <td>{o.quantity}</td>

                <td>
                  <StatusBadge status={o.payment_status} />
                </td>

                <td>
                  {o.tickets?.some((t) => t.checkin) ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      Hadir
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                      Belum
                    </span>
                  )}
                </td>

                <td className="space-x-2">
                  <button
                    onClick={() => setSelected(o)}
                    className="text-blue-600"
                  >
                    Detail
                  </button>

                  <button
                    onClick={() => manualCheckin(o.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Check-in
                  </button>

                  <button
                    onClick={() => downloadTicket(o)}
                    className="bg-pink-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Ticket
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    
    {/* ================= PAGINATION ================= */}
    {totalPages > 1 && (
      <div className="flex justify-between items-center mt-6">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded-xl disabled:opacity-50"
        >
          Prev
        </button>

        <div className="flex gap-2 items-center">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-lg border text-sm ${
                page === i + 1
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded-xl disabled:opacity-50"
        >
          Next
        </button>

      </div>
    )}
    {/* ================= DETAIL MODAL PRO ================= */}
    {selected && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">

        {/* BACKDROP */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        />

        {/* MODAL */}
        <div className="relative w-[460px] max-w-[90%] animate-[fadeIn_0.2s_ease-out]">

          <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl overflow-hidden">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-5 text-white">
              <h2 className="text-lg font-bold">
                Detail Order
              </h2>
              <p className="text-xs opacity-90">
                Informasi transaksi & tiket
              </p>
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-4 text-sm">

              {/* ORDER CODE */}
              <div className="flex justify-between">
                <span className="text-gray-500">Order</span>
                <span className="font-semibold">
                  {selected.order_code}
                </span>
              </div>

              {/* CUSTOMER */}
              <div className="border rounded-xl p-3 bg-gray-50">
                <p className="font-semibold text-gray-700">
                  {selected.customer_name}
                </p>
                <p className="text-xs text-gray-500">
                  {selected.customer_email}
                </p>
                <p className="text-xs text-gray-500">
                  {selected.customer_phone}
                </p>
              </div>

              {/* TICKET */}
              <div className="flex justify-between">
                <span className="text-gray-500">Ticket</span>
                <span className="font-medium">
                  {selected.ticket_type?.name}
                </span>
              </div>

              {/* QTY */}
              <div className="flex justify-between">
                <span className="text-gray-500">Qty</span>
                <span className="font-medium">
                  {selected.quantity}
                </span>
              </div>

              {/* STATUS */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>

                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold

                      ${
                        selected.payment_status === "paid"

                          ? "bg-green-100 text-green-700"

                          : selected.payment_status === "pending"

                          ? "bg-yellow-100 text-yellow-700"

                          : selected.payment_status === "expired"

                          ? "bg-gray-200 text-gray-700"

                          : "bg-red-100 text-red-700"
                      }

                    `}
                  >

                    {
                      selected.payment_status === "paid"

                        ? "LUNAS"

                        : selected.payment_status === "pending"

                        ? "BELUM BAYAR"

                        : selected.payment_status === "expired"

                        ? "EXPIRED"

                        : "GAGAL"
                    }

                  </span>
              </div>

              {/* TOTAL (if exists) */}
              {selected.total_amount && (
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold text-pink-600">
                    Rp{" "}
                    {Number(
                      selected.total_amount
                    ).toLocaleString("id-ID")}
                  </span>
                </div>
              )}

            </div>

            {/* FOOTER ACTION */}
            <div className="p-4 flex gap-2 bg-gray-50">

              <button
                onClick={() => setSelected(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 transition py-2 rounded-xl text-sm font-medium"
              >
                Close
              </button>

              <button
                onClick={() => downloadTicket(selected)}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-400 text-white py-2 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 transition"
              >
                Download Ticket
              </button>

            </div>

          </div>

        </div>

      </div>
        )}

    {/* ================= CREATE MODAL ================= */}
    {showCreate && (

      <div className="fixed inset-0 z-[9999] flex items-center justify-center">

        {/* BACKDROP */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setShowCreate(false)}
        />

        {/* MODAL */}
        <div className="relative bg-white rounded-3xl shadow-2xl w-[450px] max-w-[90%] p-6">

          {/* HEADER */}
          <div className="mb-5">

            <h2 className="text-2xl font-bold">
              Manual Order
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Tambahkan order manual
            </p>

          </div>

          {/* FORM */}
          <div className="space-y-4">

            {/* NAME */}
            <div>

              <label className="text-sm text-gray-600">
                Customer Name
              </label>

              <input
                type="text"
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 mt-1"
                placeholder="Nama customer"
              />

            </div>

            {/* EMAIL */}
            <div>

              <label className="text-sm text-gray-600">
                Email
              </label>

              <input
                type="email"
                name="customer_email"
                value={form.customer_email}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 mt-1"
                placeholder="Email customer"
              />

            </div>

            {/* PHONE */}
            <div>

              <label className="text-sm text-gray-600">
                Phone
              </label>

              <input
                type="text"
                name="customer_phone"
                value={form.customer_phone}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 mt-1"
                placeholder="08xxxx"
              />

            </div>

            {/* TICKET */}
            <div>

              <label className="text-sm text-gray-600">
                Ticket Type
              </label>

              <select
                name="ticket_type_id"
                value={form.ticket_type_id}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 mt-1"
              >

                <option value="">
                  Pilih Ticket
                </option>

                {ticketTypes.map((t) => (

                  <option
                    key={t.id}
                    value={t.id}
                  >

                    {t.name} - Rp{" "}
                    {Number(t.price).toLocaleString("id-ID")}

                  </option>

                ))}

              </select>

            </div>

            {/* QTY */}
            <div>

              <label className="text-sm text-gray-600">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 mt-1"
              />

            </div>

          </div>

          {/* FOOTER */}
          <div className="flex gap-3 mt-6">

            <button
              onClick={() => setShowCreate(false)}
              className="flex-1 border rounded-xl py-3"
            >
              Cancel
            </button>

            <button
              onClick={createManualOrder}
              className="flex-1 bg-pink-500 text-white rounded-xl py-3 font-semibold"
            >
              Create Order
            </button>

          </div>

        </div>

      </div>
    )}

    </div>
  );
}

// ================= STATUS BADGE =================
function StatusBadge({ status }) {
  const map = {

    paid:
      "bg-green-100 text-green-700",

    pending:
      "bg-yellow-100 text-yellow-700",

    failed:
      "bg-red-100 text-red-700",

    expired:
      "bg-gray-200 text-gray-700",

  };

  const label = {

    paid: "LUNAS",

    pending: "BELUM BAYAR",

    failed: "GAGAL",

    expired: "EXPIRED",

  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${map[status]}`}>
      {label[status] || status}
    </span>
  );
}