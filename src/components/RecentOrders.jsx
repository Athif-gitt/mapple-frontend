import { useNavigate } from "react-router-dom";

export default function RecentOrders({ orders }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold">Purchase History</h3>
        <button
          onClick={() => navigate("/orders")}
          className="text-sm text-indigo-600 hover:underline"
        >
          View all
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-slate-500">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="flex justify-between items-center p-4 border rounded-xl cursor-pointer hover:bg-slate-50"
            >
              <div>
                <p className="font-medium">#{order.id}</p>
                <p className="text-sm text-slate-500">
                  {new Date(order.created_at).toDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  ₹{(order.total_amount / 100).toLocaleString()}
                </p>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
