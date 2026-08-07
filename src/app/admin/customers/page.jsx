"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useGetUsersQuery } from "@/redux/slices/adminApi.slice";

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const {
    data: usersData,
    error,
    isLoading: loading,
    refetch,
  } = useGetUsersQuery();

  if (error) {
    toast.error("Error fetching customers", { toastId: "fetch-users-error" });
  }

  const customers = usersData
    ? usersData.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        joined: new Date(user.createdAt).toLocaleDateString(),
        orders: user.ordersCount || 0,
        spent: `₹${(user.totalSpent || 0).toFixed(2)}`,
        status: "Active", // Defaulting to active
      }))
    : [];

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
          <div className="p-4 border-b border-primary/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 bg-primary/5 border border-primary/10 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <button
              onClick={() => refetch()}
              className="bg-primary/10 hover:bg-primary/20 text-primary font-bold p-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center"
              title="Refresh Customers"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[74vh]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 z-10 bg-white shadow-sm">
                <tr className="bg-primary/5 border-b border-primary/10 text-primary/70 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Joined</th>
                  <th className="py-4 px-6">Orders</th>
                  <th className="py-4 px-6">Total Spent</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-8 text-center text-primary/60"
                    >
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, idx) => (
                    <tr
                      key={customer.id}
                      className="border-b border-primary/5 hover:bg-primary/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {customer.profileImage ? (
                            <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative shadow-sm border border-primary/20">
                              <Image
                                src={customer.profileImage}
                                alt={customer.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex-shrink-0 flex items-center justify-center text-blue-500 font-bold border border-blue-500/20">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-sm text-primary">
                              {customer.name}
                            </div>
                            <div className="text-xs text-primary/60">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-primary/60">
                        {customer.joined}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-primary">
                        {customer.orders}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-primary">
                        {customer.spent}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            customer.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : customer.status === "New"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                : "bg-primary/10 text-primary/60 border-primary/20"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-sm font-semibold text-blue-500 hover:text-blue-600 hover:underline"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-8 text-center text-primary/60"
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full border border-primary/10 flex flex-col items-center relative">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center text-primary/60 hover:text-red-500 hover:bg-red-500/10 transition-colors shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            {selectedCustomer.profileImage ? (
              <div className="w-24 h-24 rounded-full overflow-hidden relative mb-4 border border-primary/20 shadow-lg">
                <Image
                  src={selectedCustomer.profileImage}
                  alt={selectedCustomer.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 text-4xl font-black mb-4 border border-blue-500/20 shadow-lg">
                {selectedCustomer.name.charAt(0).toUpperCase()}
              </div>
            )}

            <h2 className="text-2xl font-bold text-primary text-center mb-1">
              {selectedCustomer.name}
            </h2>
            <p className="text-sm text-primary/60 mb-6">
              {selectedCustomer.email}
            </p>

            <div className="w-full bg-primary/5 rounded-2xl p-5 border border-primary/10 space-y-4">
              <div className="flex justify-between items-center border-b border-primary/10 pb-3">
                <span className="text-primary/70 font-semibold text-sm">
                  Joined Date
                </span>
                <span className="text-primary font-bold">
                  {selectedCustomer.joined}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-primary/10 pb-3">
                <span className="text-primary/70 font-semibold text-sm">
                  Total Orders
                </span>
                <span className="text-primary font-bold">
                  {selectedCustomer.orders}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-primary/10 pb-3">
                <span className="text-primary/70 font-semibold text-sm">
                  Total Spent
                </span>
                <span className="text-emerald-600 font-bold">
                  {selectedCustomer.spent}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary/70 font-semibold text-sm">
                  Account Status
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    selectedCustomer.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-primary/10 text-primary/60 border-primary/20"
                  }`}
                >
                  {selectedCustomer.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
}
