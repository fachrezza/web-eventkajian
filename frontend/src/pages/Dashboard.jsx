import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:8000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setData(res.data);
  };

  useEffect(() => {
    fetchData();

    // 🔥 auto refresh biar real-time
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard Penjualan</h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-3 gap-4">
        <Card title="Total Orders" value={data.stats.total_orders} />
        <Card title="Paid Orders" value={data.stats.paid_orders} />
        <Card title="Pending" value={data.stats.pending_orders} />
        <Card title="Tickets Sold" value={data.stats.tickets_sold} />
        <Card title="Attendance" value={data.stats.attendance} />
        <Card title="Revenue" value={data.stats.revenue} />
      </div>

      {/* SIMPLE CHART STATUS */}
      <div className="mt-6 bg-white p-4 shadow rounded">
        <h2 className="font-bold mb-2">Payment Status</h2>
        <p>Paid: {data.charts.sales_by_status.paid}</p>
        <p>Pending: {data.charts.sales_by_status.pending}</p>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 shadow rounded">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}