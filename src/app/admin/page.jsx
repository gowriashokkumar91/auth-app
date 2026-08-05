"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: "₹0.00",
    activeUsers: 0,
    totalOrders: 0,
    refunds: 0,
    recentSales: [],
    revenueData: [],
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || token === "null" || token === "undefined") {
          router.push("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else if (res.status === 401 || res.status === 403) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          toast.error("Failed to load dashboard data");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  const metrics = [
    {
      title: "Total Revenue",
      value: stats.totalRevenue,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      change: "+5%",
      trend: "up",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      change: "+8%",
      trend: "up",
    },
  ];

  const recentTransactions = stats.recentSales;

  const handleExport = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(34, 197, 94); // Tailwind emerald-500
    doc.text("SivaFarm", 14, 20);

    doc.setFontSize(16);
    doc.setTextColor(51, 65, 85); // Tailwind slate-700
    doc.text("Admin Dashboard Report", 14, 30);

    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139); // Tailwind slate-500
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 38);

    // Summary Metrics Table
    autoTable(doc, {
      startY: 45,
      head: [["Metric", "Value"]],
      body: [
        ["Total Revenue", stats.totalRevenue.toString()],
        ["Total Orders", stats.totalOrders.toString()],
        ["Active Users", stats.activeUsers.toString()],
        ["Refunds", stats.refunds.toString()],
      ],
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94] },
      margin: { top: 10 },
    });

    // All Orders Table
    const nextY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(51, 65, 85);
    doc.text("All Orders", 14, nextY);

    const salesBody = recentTransactions.map((t) => [
      t.customer,
      t.email,
      t.amount,
      t.status,
    ]);

    autoTable(doc, {
      startY: nextY + 5,
      head: [["Customer", "Email", "Amount", "Status"]],
      body:
        salesBody.length > 0 ? salesBody : [["No recent sales", "", "", ""]],
      theme: "striped",
      headStyles: { fillColor: [34, 197, 94] },
    });

    // Save PDF
    doc.save("sivafarm-dashboard-report.pdf");
    toast.success("Report downloaded successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-end gap-4">
        <button
          onClick={handleExport}
          className="bg-primary/10 hover:bg-primary/20 text-primary font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm flex items-center gap-2 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-emerald-500 group-hover:translate-y-[1px] transition-transform"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10 hover:shadow-md transition-shadow"
          >
            <h3 className="text-sm font-semibold text-primary/70 uppercase tracking-wider mb-2">
              {metric.title}
            </h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-primary">
                {metric.value}
              </span>
              <span
                className={`flex items-center text-sm font-bold ${metric.trend === "up" ? "text-emerald-500" : "text-blue-500"}`}
              >
                {metric.trend === "up" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                    <polyline points="16 17 22 17 22 11" />
                  </svg>
                )}
                <span className="ml-1">{metric.change}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-primary/10 flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-primary">
            Revenue Overview
          </h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-primary">All Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-primary/80 hover:text-primary hover:underline"
            >
              Go to Orders
            </Link>
          </div>
          <div className="space-y-6">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((trx, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary/60 font-bold">
                      {trx.customer.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary">
                        {trx.customer}
                      </h4>
                      <p className="text-xs text-primary/60">{trx.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-primary">
                      {trx.amount}
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        trx.status === "Success"
                          ? "text-emerald-500"
                          : trx.status === "Pending"
                            ? "text-blue-500"
                            : "text-blue-500"
                      }`}
                    >
                      {trx.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-primary/60 text-sm">
                No recent transactions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
