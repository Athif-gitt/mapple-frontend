import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/currency";
import Nav from "./Nav";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("access-token");
      if (!token) return;

      try {
        const res = await api.get("/orders/");
        setOrders(res.data.results ?? res.data ?? []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Nav />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Your Orders
          </h1>
          <p className="text-slate-500">
            Track, view, and manage your recent purchases.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-slate-400">
            Loading your orders…
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  {/* Left */}
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Order #{order.id}
                    </p>

                    <p className="text-lg font-semibold text-slate-900">
                      {formatCurrency(order.total_amount)}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold
                        ${order.status === "PAID"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                        }`}
                    >
                      {order.status}
                    </span>

                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors cursor-pointer"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 p-4 rounded-full bg-slate-100 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h18l-2 13H5L3 3zM16 16a2 2 0 11-4 0"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No orders yet
            </h2>
            <p className="text-slate-500 mb-6">
              Looks like you haven’t placed any orders.
            </p>

            <Link
              to="/products"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
