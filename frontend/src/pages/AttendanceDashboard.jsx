import { useEffect, useState } from "react";
import axios from "axios";

export default function AttendanceDashboard() {
  const [tickets, setTickets] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    checked_in: 0,
    not_checked_in: 0,
  });

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/attendance");

      setTickets(res.data.data);
      setSummary(res.data.summary);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
        fetchData();
    }, 3000); // setiap 3 detik

    return () => clearInterval(interval);
    }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>🎫 Attendance Dashboard</h2>

      {/* SUMMARY BOX */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <div style={{ padding: 10, border: "1px solid #ccc" }}>
          <h3>Total</h3>
          <p>{summary.total}</p>
        </div>

        <div style={{ padding: 10, border: "1px solid #ccc" }}>
          <h3>Checked In</h3>
          <p>{summary.checked_in}</p>
        </div>

        <div style={{ padding: 10, border: "1px solid #ccc" }}>
          <h3>Not Yet</h3>
          <p>{summary.not_checked_in}</p>
        </div>
      </div>


      {/* TABLE */}
      <table border="1" cellPadding="10" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>Order Code</th>
            <th>Ticket Code</th>
            <th>Customer</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td>{t.order?.order_code}</td>
              <td>{t.ticket_code}</td>
              <td>{t.order?.customer_name}</td>
              <td>
                {t.status === "used" ? "✅ Checked In" : "⏳ Not Yet"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}