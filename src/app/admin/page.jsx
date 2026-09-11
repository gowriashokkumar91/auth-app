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

import { useGetDashboardStatsQuery } from "@/redux/slices/adminApi.slice";

export default function AdminDashboardPage() {
  const router = useRouter();

  const {
    data: dashboardData,
    error,
    isLoading: loading,
  } = useGetDashboardStatsQuery();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (error) {
      if (error.status === 401 || error.status === 403) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        toast.error("Failed to load dashboard data");
      }
    }
  }, [error, router]);

  const stats = dashboardData || {
    totalRevenue: "₹0.00",
    activeUsers: 0,
    totalOrders: 0,
    refunds: 0,
    recentSales: [],
    revenueData: [],
  };

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
      {/* Metrics Section */}
      <div className="grid grid-cols-4 gap-2 sm:gap-6 w-full">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-6 shadow-sm border border-primary/10 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden flex flex-col justify-center items-center min-h-[70px] sm:h-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-[7.5px] sm:text-xs font-bold text-primary/60 uppercase tracking-wider relative z-10 group-hover:text-primary/80 transition-colors text-center leading-tight">
              {metric.title}
            </h3>
            <span className="text-[11px] sm:text-3xl font-black text-primary group-hover:scale-105 transition-transform duration-300 relative z-10 my-0.5 text-center break-all">
              {metric.value}
            </span>
            <span
              className={`flex items-center text-[7px] sm:text-sm font-bold px-1 py-0.5 rounded-sm sm:rounded-lg ${metric.trend === "up" ? "text-primary bg-primary/5" : "text-blue-500 bg-blue-500/5"} relative z-10`}
            >
              {metric.trend === "up" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="sm:w-[14px] sm:h-[14px]"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="sm:w-[14px] sm:h-[14px]"
                >
                  <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                  <polyline points="16 17 22 17 22 11" />
                </svg>
              )}
              <span className="ml-0.5">{metric.change}</span>
            </span>
          </div>
        ))}

        {/* Export Report Button */}
        <div className="flex items-center justify-center min-h-[70px] sm:h-auto w-full">
          <button
            onClick={handleExportExcel}
            className="group relative w-full h-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-1.5 sm:px-6 sm:py-3 bg-primary text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-primary/90 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:-translate-y-0.5 transition-transform duration-300 relative z-10 sm:w-[18px] sm:h-[18px]"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            <span className="relative z-10 text-[7.5px] sm:text-sm text-center leading-tight">
              EXPORT
              <br className="sm:hidden" />
              REPORT
            </span>
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
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  dy={10}
                  interval={0}
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
                <Bar
                  dataKey="revenue"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={48}
                />
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
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary/60 font-bold shrink-0">
                      {trx.customer.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-primary truncate">
                        {trx.customer}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-primary/60 truncate">
                        {trx.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-sm text-primary">
                      {trx.amount}
                    </div>
                    <div
                      className={`text-[10px] sm:text-xs font-semibold ${
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
