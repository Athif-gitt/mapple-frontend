import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { useParams, useNavigate } from "react-router-dom";

function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await api.get(
        `/orders/admin/orders/${id}/`
      );
      setOrder(res.data);
    };
    fetchOrder();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      const res = await api.patch(
        `/orders/admin/orders/${id}/status/`,
        { status }
      );
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (!order) {
    return <div className="p-6">Loading order…</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline"
      >
        ← Back to Orders
      </button>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Order #{order.id}</h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <p><b>User:</b> {order.username}</p>
          <p className="flex items-center gap-2">
            <b>Status:</b>
            <span className={`px-2 py-1 rounded text-xs font-semibold border ${order.status === 'PAID' ? 'admin-badge-success' :
                order.status === 'PENDING' ? 'admin-badge-warning' :
                  order.status === 'FAILED' ? 'admin-badge-danger' :
                    order.status === 'CANCELLED' ? 'admin-badge-neutral' : ''
              }`}>
              {order.status}
            </span>
          </p>
          <p><b>Total Amount:</b> ₹ {order.total_amount}</p>
          <p>
            <b>Created:</b>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        {/* Status Controls */}
        <div className="mt-4 space-x-2">
          {["PAID", "CANCELLED", "FAILED"].map((s) => (
            <button
              key={s}
              disabled={updating}
              onClick={() => updateStatus(s)}
              className={`px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 ${s === 'PAID' ? 'admin-btn-success' :
                  s === 'FAILED' ? 'admin-btn-danger' :
                    s === 'CANCELLED' ? 'admin-btn-neutral' : ''
                }`}
            >
              Mark {s}
            </button>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Items</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Product</th>
              <th className="text-left py-2">Qty</th>
              <th className="text-left py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{item.product_name}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2">₹ {item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrderDetail;
