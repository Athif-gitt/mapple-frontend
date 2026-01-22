import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import Nav from "./Nav";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}/`);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Nav />
        <div className="py-32 text-center text-slate-400">
          Loading order details…
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Nav />
        <div className="py-32 text-center">
          <h2 className="text-2xl font-bold mb-2">Order not found</h2>
          <button
            onClick={() => navigate("/orders")}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Nav />

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Order #{order.id}
            </h1>
            <p className="text-slate-500 mt-1">
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <span
            className={`inline-block px-5 py-2 rounded-full text-sm font-semibold
              ${
                order.status === "PAID"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
          >
            {order.status}
          </span>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-slate-500 mb-1">Order Total</p>
            <p className="text-2xl font-bold text-slate-900">
              ${order.total_amount}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500 mb-1">Payment</p>
            <p className="font-semibold text-slate-800">Online</p>
          </div>

          <div>
            <p className="text-sm text-slate-500 mb-1">Delivery</p>
            <p className="font-semibold text-slate-800">Standard Shipping</p>
          </div>
        </div>

        {/* Items */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Items in this order
          </h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-5 hover:shadow-md transition"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    ${item.price} × {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="pt-6">
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-indigo-600 transition"
          >
            ← Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
}
