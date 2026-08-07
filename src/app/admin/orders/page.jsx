"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/slices/adminApi.slice";

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("All Orders");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: ordersData,
    error,
    isLoading: loading,
    refetch,
  } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  if (error) {
    toast.error("Error fetching orders", {
      toastId: "fetch-orders-error",
    });
  }

  const orders = useMemo(() => {
    return ordersData
      ? ordersData.map((order) => ({
          id: order._id,
          customer: order.customerName,
          items: order.items.reduce((acc, item) => acc + item.quantity, 0),
          total: `₹${order.totalAmount.toFixed(2)}`,
          date: new Date(order.createdAt).toLocaleString(),
          status: order.status,
          rawItems: order.items,
          subtotal: order.subtotal || 0,
          greensSavings: order.greensSavings || 0,
          firstOrderDiscount: order.firstOrderDiscount || 0,
          deliveryFee: order.deliveryFee || 0,
        }))
      : [];
  }, [ordersData]);

  const handleCloseModal = () => {
    setSelectedOrder(null);
    if (searchParams.has("orderId")) {
      router.replace(pathname, { scroll: false });
    }
  };

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId && orders.length > 0) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [searchParams, orders]);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "All Orders" || order.status === filter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUpdateStatus = async (status) => {
    try {
      await updateOrderStatus({ id: selectedOrder.id, status }).unwrap();
      toast.success(`Order marked as ${status}`);
      setSelectedOrder({ ...selectedOrder, status });
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
        <div className="p-4 border-b border-primary/10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("All Orders")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === "All Orders" ? "bg-primary text-white" : "bg-transparent text-primary/60 hover:text-primary"}`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter("Processing")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === "Processing" ? "bg-primary text-white" : "bg-transparent text-primary/60 hover:text-primary"}`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilter("Delivered")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === "Delivered" ? "bg-primary text-white" : "bg-transparent text-primary/60 hover:text-primary"}`}
            >
              Delivered
            </button>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-primary/5 border border-primary/10 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
            />
            <button
              onClick={() => refetch()}
              className="bg-primary/10 hover:bg-primary/20 text-primary font-bold p-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center"
              title="Refresh Orders"
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
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[74vh]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 z-10 bg-white shadow-sm">
              <tr className="bg-primary/5 border-b border-primary/10 text-primary/70 text-xs uppercase tracking-wider font-semibold">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Items</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-primary/60">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className="border-b border-primary/5 hover:bg-primary/5 transition-colors"
                  >
                    <td
                      className="py-4 px-6 font-bold text-sm text-primary"
                      title={order.id}
                    >
                      #{order.id.substring(order.id.length - 6).toUpperCase()}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-primary/80">
                      {order.customer}
                    </td>
                    <td className="py-4 px-6 text-sm text-primary/60">
                      {order.date}
                    </td>
                    <td className="py-4 px-6 text-sm text-primary/60">
                      {order.items}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-primary">
                      {order.total}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          order.status === "Delivered"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : order.status === "Processing"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : order.status === "In Transit"
                                ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-sm font-semibold text-primary/80 hover:text-primary hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-primary/60">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-primary/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-primary/5">
              <div>
                <h3
                  className="text-xl font-bold flex items-center gap-3 text-primary"
                  title={selectedOrder.id}
                >
                  Order #
                  {selectedOrder.id
                    .substring(selectedOrder.id.length - 6)
                    .toUpperCase()}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      selectedOrder.status === "Delivered"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : selectedOrder.status === "Processing"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : selectedOrder.status === "In Transit"
                            ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </h3>
                <p className="text-sm text-primary/60 mt-1">
                  Placed {selectedOrder.date} by {selectedOrder.customer}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary/60 hover:text-red-500 hover:bg-red-500/10 transition-colors shadow-sm border border-primary/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <h4 className="font-bold text-lg mb-3 text-primary">
                  Items in this order ({selectedOrder.items})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.rawItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-3 rounded-xl border border-primary/10 bg-primary/5 items-center"
                    >
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0 border border-primary/5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-primary/50"
                        >
                          <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                          <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                          <path d="M2 7h20" />
                          <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-primary">{item.name}</h5>
                        <p className="text-xs text-primary/60">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="font-bold text-primary">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Customer Details
                  </h4>
                  <p className="text-sm text-primary/80 leading-relaxed">
                    Name: {selectedOrder.customer}
                    <br />
                    ID: {selectedOrder.id}
                  </p>
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                    Payment Info
                  </h4>
                  <div className="text-sm text-primary/80 leading-relaxed space-y-1">
                    <div>Method: Cash on Delivery</div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{selectedOrder.subtotal}</span>
                    </div>
                    {selectedOrder.greensSavings > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Greens Savings:</span>
                        <span>- ₹{selectedOrder.greensSavings}</span>
                      </div>
                    )}
                    {selectedOrder.firstOrderDiscount > 0 && (
                      <div className="flex justify-between text-accent font-medium">
                        <span>First Order Discount:</span>
                        <span>- ₹{selectedOrder.firstOrderDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>
                        {selectedOrder.deliveryFee === 0
                          ? "FREE"
                          : `+ ₹${selectedOrder.deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-primary/10 pt-1 mt-1 font-bold text-primary">
                      <span>Total Amount:</span>
                      <span>{selectedOrder.total}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-primary/10">
                    <h5 className="font-bold text-sm mb-2 text-primary">
                      Update Status:
                    </h5>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus("Processing")}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
                      >
                        Process
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("Delivered")}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                      >
                        Deliver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-primary/10 bg-primary/5 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
