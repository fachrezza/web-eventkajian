import { useEffect, useState } from "react";
import axios from "axios";

import Chart from "react-apexcharts";

export default function DashboardHome() {

  const [data, setData] =
    useState(null);

  const fetchData = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/api/dashboard",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setData(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  useEffect(() => {

    fetchData();

    const interval =
      setInterval(fetchData, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  if (!data)
    return (
      <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center text-black">
        Loading Dashboard...
      </div>
    );

  const stats = data.stats;
  const charts = data.charts;

  /*
  |--------------------------------------------------------------------------
  | PIE / DONUT CHART
  |--------------------------------------------------------------------------
  */

  const donutSeries = [

    charts.sales_by_status.paid,

    charts.sales_by_status.pending,

    charts.sales_by_status.failed,

    charts.sales_by_status.expired,

  ];

  const donutOptions = {

    chart: {
      type: "donut",
      background: "transparent",
    },

    labels: [
      "Paid",
      "Pending",
      "Failed",
      "Expired",
    ],

    theme: {
      mode: "light",
    },

    colors: [
      "#22c55e",
      "#facc15",
      "#ef4444",
      "#94a3b8",
    ],

    legend: {
      labels: {
        colors: "black",
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      width: 0,
    },

    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },

  };

  /*
  |--------------------------------------------------------------------------
  | AREA CHART
  |--------------------------------------------------------------------------
  */

  const areaOptions = {

    chart: {

      type: "area",

      toolbar: {
        show: false,
      },

      background: "transparent",

    },

    theme: {
      mode: "light",
    },

    stroke: {
      curve: "smooth",
      width: 4,
    },

    colors: ["#ec4899"],

    fill: {

      type: "gradient",

      gradient: {

        shadeIntensity: 1,

        opacityFrom: 0.5,

        opacityTo: 0,

      },

    },

    dataLabels: {
      enabled: false,
    },

    grid: {
      borderColor: "#fbcfe8",
    },

    xaxis: {

      categories:
        charts.sales_chart.map(
          (i) => i.date
        ),

      labels: {
        style: {
          colors: "#6b7280",
        },
      },

    },

    yaxis: {

      labels: {

        style: {
          colors: "#6b7280",
        },

      },

    },

    tooltip: {
      theme: "dark",
    },

  };

  const areaSeries = [

    {

      name: "Revenue",

      data:
        charts.sales_chart.map(
          (i) => i.total
        ),

    },

  ];

  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white text-gray-800 p-6">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-rose-400 to-pink-300 bg-clip-text text-transparent">
          Event Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Real-time analytics & monitoring
        </p>

      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">

        <KpiCard
          title="Revenue"
          value={`Rp ${Number(
            stats.revenue
          ).toLocaleString("id-ID")}`}
        />

        <KpiCard
          title="Orders"
          value={stats.total_orders}
        />

        <KpiCard
          title="Paid"
          value={stats.paid_orders}
        />

        <KpiCard
          title="Pending"
          value={stats.pending_orders}
        />

        <KpiCard
          title="Failed"
          value={stats.failed_orders}
        />

        <KpiCard
          title="Expired"
          value={stats.expired_orders}
        />

        <KpiCard
          title="Tickets"
          value={stats.tickets_sold}
        />

        <KpiCard
          title="Attendance"
          value={stats.attendance}
        />

      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* AREA CHART */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-pink-100 rounded-3xl p-6 shadow-lg">

          <div className="flex justify-between items-center mb-4">

            <div>

              <h2 className="text-xl font-bold">
                Revenue Analytics
              </h2>

              <p className="text-gray-500 text-sm">
                Daily sales overview
              </p>

            </div>

            <div className="bg-pink-500/20 text-pink-400 px-4 py-2 rounded-xl text-sm">
              LIVE
            </div>

          </div>

          <Chart
            options={areaOptions}
            series={areaSeries}
            type="area"
            height={350}
          />

        </div>

        {/* DONUT */}
        <div className="bg-white/80 backdrop-blur-xl border border-pink-100 rounded-3xl p-6 shadow-lg">

          <h2 className="text-xl font-bold mb-2">
            Order Status
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Payment distribution
          </p>

          <Chart
            options={donutOptions}
            series={donutSeries}
            type="donut"
            height={400}
          />

        </div>

      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        <GlassCard>

          <p className="text-gray-500 text-sm">
            Conversion Rate
          </p>

          <h2 className="text-4xl font-bold text-green-400 mt-3">

            {
              stats.total_orders

                ? Math.round(
                    (
                      stats.paid_orders /
                      stats.total_orders
                    ) * 100
                  )

                : 0
            }%

          </h2>

        </GlassCard>

        <GlassCard>

          <p className="text-gray-500 text-sm">
            Avg Order Value
          </p>

          <h2 className="text-4xl font-bold text-cyan-400 mt-3">

            Rp {

              stats.total_orders

                ? Math.round(
                    stats.revenue /
                    stats.total_orders
                  ).toLocaleString("id-ID")

                : 0

            }

          </h2>

        </GlassCard>

        <GlassCard>

          <p className="text-gray-500 text-sm">
            System Status
          </p>

          <h2 className="text-4xl font-bold text-pink-400 mt-3">
            ACTIVE
          </h2>

        </GlassCard>

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| KPI CARD
|--------------------------------------------------------------------------
*/

function KpiCard({
  title,
  value,
}) {

  return (

    <div className="bg-white/80 border border-pink-100 backdrop-blur-xl rounded-2xl p-4 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-pink-100">

      <p className="text-xs text-gray-500">
        {title}
      </p>

      <h2 className="text-xl font-bold mt-2 text-gray-800">
        {value}
      </h2>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| GLASS CARD
|--------------------------------------------------------------------------
*/

function GlassCard({
  children,
}) {

  return (

    <div className="bg-white/80 border border-pink-100 backdrop-blur-xl rounded-3xl p-6 shadow-lg hover:shadow-pink-100 transition">

      {children}

    </div>
  );
}