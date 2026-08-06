"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
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

  const handleExportExcel = async () => {
    try {
      const ExcelJS = (await import("exceljs")).default;
      const { saveAs } = await import("file-saver");

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Dashboard Report");

      // Title & Date
      sheet.mergeCells("A1:D1");
      sheet.getCell("A1").value = "Sivamazhil Admin Dashboard Report";
      sheet.getCell("A1").font = {
        size: 16,
        bold: true,
        color: { argb: "FF10B981" },
      }; // Emerald 500
      sheet.getCell("A1").alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      sheet.mergeCells("A2:D2");
      sheet.getCell("A2").value =
        `Generated on: ${new Date().toLocaleString()}`;
      sheet.getCell("A2").font = {
        size: 11,
        italic: true,
        color: { argb: "FF64748B" },
      }; // Slate 500
      sheet.getCell("A2").alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      sheet.addRow([]); // Empty Row 3

      // Metrics Table Headers
      sheet.addRow(["Metric", "Value"]); // Row 4
      const metricHeader = sheet.getRow(4);
      metricHeader.font = { bold: true, color: { argb: "FFFFFFFF" } };
      metricHeader.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF10B981" },
      }; // Emerald 500
      metricHeader.alignment = { horizontal: "center" };

      // Metrics Data
      const m1 = sheet.addRow(["Total Revenue", stats.totalRevenue]);
      const m2 = sheet.addRow(["Total Orders", stats.totalOrders]);
      const m3 = sheet.addRow(["Active Users", stats.activeUsers]);
      const m4 = sheet.addRow(["Refunds", stats.refunds]);

      [m1, m2, m3, m4].forEach((row) => {
        row.getCell(1).alignment = { horizontal: "left" };
        row.getCell(2).alignment = { horizontal: "right" };
      });

      sheet.addRow([]); // Empty Row 9

      // Orders Header
      const orderTitleRow = sheet.addRow(["Recent Orders"]); // Row 10
      orderTitleRow.font = {
        size: 14,
        bold: true,
        color: { argb: "FF0F172A" },
      };
      sheet.mergeCells(`A${orderTitleRow.number}:D${orderTitleRow.number}`);
      orderTitleRow.alignment = { horizontal: "left" };

      // Orders Table Headers
      sheet.addRow(["Customer", "Email", "Amount", "Status"]); // Row 11
      const orderHeader = sheet.getRow(11);
      orderHeader.font = { bold: true, color: { argb: "FFFFFFFF" } };
      orderHeader.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF3B82F6" },
      }; // Blue 500
      orderHeader.alignment = { horizontal: "center" };

      // Orders Data
      recentTransactions.forEach((t) => {
        const row = sheet.addRow([t.customer, t.email, t.amount, t.status]);
        row.alignment = { horizontal: "center" };
        row.getCell(1).alignment = { horizontal: "left" };
        row.getCell(2).alignment = { horizontal: "left" };
      });

      // Set Column Widths
      sheet.getColumn(1).width = 25;
      sheet.getColumn(2).width = 35;
      sheet.getColumn(3).width = 15;
      sheet.getColumn(4).width = 15;

      // Add Borders
      sheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          if (rowNumber >= 4 && cell.value !== null && cell.value !== "") {
            cell.border = {
              top: { style: "thin", color: { argb: "FFE2E8F0" } },
              left: { style: "thin", color: { argb: "FFE2E8F0" } },
              bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
              right: { style: "thin", color: { argb: "FFE2E8F0" } },
            };
          }
        });
      });

      // Generate File & Save
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), "sivamazhil-dashboard-report.xlsx");
      toast.success("Styled Excel report downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate styled Excel report");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className={`flex items-center text-sm font-bold ${metric.trend === "up" ? "text-primary" : "text-blue-500"}`}
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

        {/* Export Report Button */}
        <div className="flex items-center justify-center h-[100px] lg:h-full">
          <button
            onClick={handleExportExcel}
            className="group relative flex items-center gap-2.5 px-6 py-3 bg-primary text-white font-bold text-sm tracking-wide rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-y-0.5 transition-transform duration-300"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            EXPORT REPORT
          </button>
        </div>
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
          <div className="space-y-6 max-h-[340px] overflow-y-auto -mr-4 pr-4">
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
