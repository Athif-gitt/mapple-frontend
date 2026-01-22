import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { Link } from "react-router-dom";
import Nav from "./Nav";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("access-token");
      if (!token) return;

      try {
        const res = await api.get(
          "/orders/"
        );

        console.log("Orders fetched:", res.data);
        setOrders(res.data.results ?? res.data ?? []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-0">
      <Nav />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h1>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg shadow-md space-y-2"
            >
              <h2 className="text-xl font-semibold">
                Order #{order.id}
              </h2>

              <p>
                Status:
                <span
                  className={
                    order.status === "PAID"
                      ? "text-green-600 font-bold ml-2"
                      : "text-yellow-600 font-bold ml-2"
                  }
                >
                  {order.status}
                </span>
              </p>

              <p>Total: <span className="font-bold">${order.total_amount}</span></p>
              <p>Date: {new Date(order.created_at).toLocaleString()}</p>

              <Link
                to={`/orders/${order.id}`}
                className="inline-block mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No orders yet.</p>
      )}
    </div>
  );
}
